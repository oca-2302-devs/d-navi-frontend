import * as crypto from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { handler as bedrockHandler } from "./bedrock";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME;

/* ===============================
   Types
================================ */

type RoomStatus = "OPEN" | "ACTIVE" | "CLOSED";
type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

interface MeetupPoint {
  nodeID: number;
}

type Room = {
  roomId: string;
  status: RoomStatus | string;
  meetupPoint: MeetupPoint | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: number;
};

interface RoomMetadata {
  PK: string;
  SK: string;
  entity: string;
  roomId: string;
  status: RoomStatus | string;
  meetupPoint?: string | null; // stored as JSON string in DB
  guestLimit: number;
  hostTokenHash: string;
  guestTokenHash?: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: number;
}

interface PendingRequestItem {
  PK: string;
  SK: string;
  entity: string;
  status: RequestStatus | string;
  createdAt: string;
  updatedAt: string;
  expiresAt: number;
}

/* ===============================
   Helpers
================================ */

export async function addDummyData() {
  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    throw new Error("TABLE_NAME is not set");
  }

  const item = {
    PK: "TEST#Saryu",
    SK: "QR#",
    type: "STRING",
    data: JSON.stringify({ hello: "test1" }),
    createdAt: new Date().toISOString(),
  };

  await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  );

  return { ok: true, saved: item };
}

export async function getMapData(pk: string) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": pk,
    },
  };

  const result = await ddb.send(new QueryCommand(params));
  return result.Items;
}

export async function getMapNodes(pk: string) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": pk,
      ":skPrefix": "NODE#",
    },
  };

  const result = await ddb.send(new QueryCommand(params));
  return result.Items;
}

function mustTable() {
  //環境変数のtableが入ってるか確認
  if (!TABLE_NAME) throw new Error("TABLE_NAME is not set");
}

const ROOM_TTL_MINUTES = Number(process.env.ROOM_TTL_MINUTES ?? "60");

function nowIso() {
  return new Date().toISOString();
}
function ttlSeconds(minutes = ROOM_TTL_MINUTES) {
  return Math.floor(Date.now() / 1000) + minutes * 60;
}

function genToken(prefix: string) {
  return `${prefix}_${crypto.randomBytes(24).toString("base64url")}`;
}
function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function roomPk(roomId: string) {
  return `ROOM#${roomId}`;
}

function toRoom(meta: RoomMetadata): Room {
  return {
    roomId: meta.roomId,
    status: meta.status,
    meetupPoint: meta.meetupPoint ? JSON.parse(meta.meetupPoint) : null,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    expiresAt: meta.expiresAt,
  };
}

// ---------- Query ----------
export async function getRoom(roomId: string) {
  mustTable();
  const res = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: roomPk(roomId), SK: "META" },
    })
  );
  return res.Item ? toRoom(res.Item as RoomMetadata) : null;
}

export async function getRequest(roomId: string) {
  mustTable();
  const res = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: roomPk(roomId), SK: "REQUEST" },
    })
  );
  return res.Item?.status ?? null; // "PENDING" etc
}

// ---------- Mutations ----------
export async function createRoom(hostNodeID: number) {
  mustTable();

  if (typeof hostNodeID !== "number" || Number.isNaN(hostNodeID)) {
    throw new Error("hostNodeID is required");
  }

  const roomId = crypto.randomUUID();
  const createdAt = nowIso();
  const updatedAt = createdAt;
  const expiresAt = ttlSeconds();

  const hostToken = genToken("host"); // 生トークン（クライアントに返す）
  const hostTokenHash = hashToken(hostToken); // DB保存用

  const pk = roomPk(roomId);

  const metaItem: RoomMetadata = {
    PK: pk,
    SK: "META",
    entity: "ROOM",
    roomId,
    status: "OPEN",
    meetupPoint: null, // approveJoinで決める
    guestLimit: 1,
    hostTokenHash,
    guestTokenHash: null,
    createdAt,
    updatedAt,
    expiresAt,
  };

  const hostMemberItem = {
    PK: pk,
    SK: "MEMBER#HOST",
    entity: "MEMBER",
    role: "HOST",
    state: "JOINED",
    data: JSON.stringify({
      hostNodeID, // フロントから来た nodeID
      hostTokenHash, // Lambdaが発行したhostTokenのhash（推奨）
    }),
    createdAt,
    updatedAt,
    expiresAt,
  };

  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: metaItem }));
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: hostMemberItem }));

  return {
    room: toRoom(metaItem),
    hostToken, // 生トークンは返す（DBには保存しない）
  };
}

export async function requestJoin(roomId: string, guestNodeID: number) {
  mustTable();
  const pk = roomPk(roomId);

  // ルーム存在＆OPEN確認
  const metaRes = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: pk, SK: "META" } })
  );
  const meta = metaRes.Item as RoomMetadata | undefined;
  if (!meta) throw new Error("Room not found");
  if (meta.status !== "OPEN") throw new Error("Room is not open");

  const createdAt = nowIso();
  const updatedAt = createdAt;

  // 二重申請防止：REQUESTが無い時だけ作る
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: pk,
        SK: "REQUEST#" + guestNodeID,
        entity: "REQUEST",
        status: "PENDING",
        createdAt,
        updatedAt,
        expiresAt: meta.expiresAt,
      },
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  // Schemaの返り値に合わせて（例）
  return { ok: true, status: "PENDING" };
}

export async function approveJoin(roomId: string, hostToken: string, hostNodeID: number) {
  mustTable();
  if (!hostToken) throw new Error("hostToken is required");

  const pk = roomPk(roomId);

  const metaRes = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: pk, SK: "META" } })
  );
  const meta = metaRes.Item as RoomMetadata | undefined;
  if (!meta) throw new Error("Room not found");
  if (hashToken(hostToken) !== meta.hostTokenHash) throw new Error("Not host");

  // REQUEST#<guestNodeID> を探して guestNodeID を取り出す
  const pendingReq = await getPendingRequestForRoom(pk);
  if (!pendingReq) throw new Error("No pending join request");

  const { item: requestItem, guestNodeID } = pendingReq; // ここで guestNodeID が取れた！(guestNodeID)の中に入ってる

  const bedrockRes = await bedrockHandler({
    endpoints: [guestNodeID, hostNodeID],
  });

  if (bedrockRes?.statusCode !== 200) {
    throw new Error(`MeetingPoint compute failed: ${bedrockRes?.body ?? "unknown"}`);
  }

  // body をオブジェクト化（bedrockの全結果）
  const bedrockBody =
    typeof bedrockRes.body === "string" ? JSON.parse(bedrockRes.body) : bedrockRes.body;

  // DB保存用に meetingPoint を取り出す
  const meetupNodeID = Number(bedrockBody.meetingPoint);
  if (!Number.isFinite(meetupNodeID)) {
    throw new Error(`Invalid meetingPoint from bedrock: ${bedrockRes.body}`);
  }

  const guestToken = genToken("guest");
  const guestTokenHash = hashToken(guestToken);
  const updatedAt = nowIso();

  // META更新：guestTokenHashセット + ACTIVE化
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: "META" },
      UpdateExpression: "SET guestTokenHash = :g, #st = :active, meetupPoint = :mp, updatedAt = :u",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":g": guestTokenHash,
        ":active": "ACTIVE",
        ":mp": JSON.stringify({ nodeID: meetupNodeID }),
        ":u": updatedAt,
        ":null": null,
      },
      ConditionExpression: "attribute_not_exists(guestTokenHash) OR guestTokenHash = :null",
    })
  );

  // REQUESTをAPPROVEDへ
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: requestItem.SK },
      UpdateExpression: "SET #st = :approved, updatedAt = :u",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":approved": "APPROVED",
        ":u": updatedAt,
        ":pending": "PENDING",
      },
      ConditionExpression: "#st = :pending",
    })
  );

  // MEMBER#GUEST作成（存在したら弾く）
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: pk,
        SK: "MEMBER#GUEST",
        entity: "MEMBER",
        role: "GUEST",
        state: "JOINED",
        createdAt: requestItem.createdAt ?? updatedAt,
        updatedAt,
        expiresAt: meta.expiresAt,
      },
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return { ok: true, guestToken, bedrock: bedrockBody };
}

export async function rejectJoin(roomId: string, hostToken: string) {
  mustTable();
  if (!hostToken) throw new Error("hostToken is required");

  const pk = roomPk(roomId);

  const metaRes = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: pk, SK: "META" } })
  );
  const meta = metaRes.Item as RoomMetadata | undefined;
  if (!meta) throw new Error("Room not found");
  if (hashToken(hostToken) !== meta.hostTokenHash) throw new Error("Not host");

  const updatedAt = nowIso();

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: "REQUEST" },
      UpdateExpression: "SET #st = :rejected, updatedAt = :u",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: { ":rejected": "REJECTED", ":u": updatedAt },
    })
  );

  return { ok: true };
}

// ---------------OTHER FUNC-----------------
async function getPendingRequestForRoom(pk: string) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":prefix": "REQUEST#",
      },
      // guestは1人想定なので1件だけでOK
      Limit: 10,
    })
  );

  const items = (res.Items as PendingRequestItem[]) ?? [];
  if (items.length === 0) return null;

  // PENDING のものを探す（複数あっても安全）
  const pending = items.find((it) => it.status === "PENDING") ?? null;
  if (!pending) return null;

  // SK = "REQUEST#64" から nodeID を取り出す
  const sk = pending.SK ?? "";
  const guestNodeIDStr = sk.split("#")[1];
  const guestNodeID = Number(guestNodeIDStr);

  if (!Number.isFinite(guestNodeID)) {
    throw new Error(`Invalid request SK format: ${sk}`);
  }

  return { item: pending, guestNodeID };
}
