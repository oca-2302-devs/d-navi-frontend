import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient, QueryCommand, type AttributeValue } from "@aws-sdk/client-dynamodb";

/* ===============================
   AWS Clients
================================ */

const dynamo = new DynamoDBClient({ region: "ap-northeast-1" });

const bedrock = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION,
});

/* ===============================
   Types
================================ */

type GraphNode = {
  node: string;
  cost: number;
  type: string;
};

type Graph = {
  [key: string]: GraphNode[];
};

type PathDetail = {
  from: string;
  to: string;
  type: string;
  cost: number;
};

type DijkstraResult = {
  path: string[] | null;
  distance: number | null;
};

type MeetingPointResult = {
  host: {
    start: string;
    end: string;
    path: string[];
    pathDetails: PathDetail[];
    cost: number;
  };
  guest: {
    start: string;
    end: string;
    path: string[];
    pathDetails: PathDetail[];
    cost: number;
  };
  meetingPoint: string;
  totalCost: number;
} | null;

interface DynamoDBEdge {
  PK?: AttributeValue;
  SK?: AttributeValue;
  data?: {
    M: {
      source?: { S: string };
      target?: { S: string };
      cost?: { N: string };
      type?: { S: string };
    };
  };
}

interface BedrockInput {
  currentDatetime: string;
  timezone: string;
  host: {
    cost: number;
    pathDetails: PathDetail[];
  };
  guest: {
    cost: number;
    pathDetails: PathDetail[];
  };
  meetingPoint: string;
}

interface BedrockTimeResult {
  hostArrivalTime: string;
  guestArrivalTime: string;
  meetingTime: string;
  assumptions: {
    elevatorCount: string;
    addedPenaltySeconds: number;
    congestionLevel: string;
  };
}

interface BedrockHandlerEvent {
  endpoints: (string | number)[];
}

/* ===============================
   Dijkstra & Path Helpers
================================ */

function dijkstra(graph: Graph, start: string, end: string): DijkstraResult {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const unvisited = new Set<string>();

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDistance = Infinity;

    for (const node of Array.from(unvisited)) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || current === end) break;

    unvisited.delete(current);

    if (graph[current]) {
      for (const neighbor of graph[current]) {
        const distance = distances[current] + neighbor.cost;
        if (distance < distances[neighbor.node]) {
          distances[neighbor.node] = distance;
          previous[neighbor.node] = current;
        }
      }
    }
  }

  const path: string[] = [];
  let current: string | null = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path.length > 1 ? path : null,
    distance: distances[end] === Infinity ? null : distances[end],
  };
}

// 経路に含まれるEdgeの詳細（タイプ情報など）を抽出する関数
function getPathDetails(graph: Graph, path: string[]): PathDetail[] {
  if (!path || path.length < 2) return [];

  const details: PathDetail[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    // currentからnextへの接続情報を探す
    const edge = graph[current].find((n) => n.node === next);
    if (edge) {
      details.push({
        from: current,
        to: next,
        type: edge.type, // elevator, escalator, corridor等
        cost: edge.cost,
      });
    }
  }
  return details;
}

/* ===============================
   Graph Builder
================================ */

function buildGraph(edges: Record<string, AttributeValue>[]): Graph {
  const graph: Graph = {};

  for (const edge of edges as unknown as DynamoDBEdge[]) {
    // Note: This logic assumes a specific structure for edge.data.
    // If edge.data is marshalled or not depends on the client used.
    // Here we assume standard DynamoDB JSON format as returned by 'new DynamoDBClient()' + 'QueryCommand'.

    const sourceNode = edge.data?.M?.source?.S;
    const targetNode = edge.data?.M?.target?.S;
    const cost = parseInt(edge.data?.M?.cost?.N || "0", 10);
    const type = edge.data?.M?.type?.S || "corridor";

    if (sourceNode && targetNode) {
      if (!graph[sourceNode]) graph[sourceNode] = [];
      graph[sourceNode].push({ node: targetNode, cost, type });
    }
  }

  return graph;
}

/* ===============================
   Meeting Point Finder
================================ */

function findMeetingPoint(graph: Graph, node1: string, node2: string): MeetingPointResult {
  const shortest = dijkstra(graph, node1, node2);
  if (!shortest.path) return null;

  let best: MeetingPointResult = null;
  let minDiff = Infinity;

  for (const center of shortest.path) {
    if (center === node1 || center === node2) continue;

    const r1 = dijkstra(graph, node1, center);
    const r2 = dijkstra(graph, node2, center);

    if (r1.distance === null || r2.distance === null) continue;
    if (r1.path === null || r2.path === null) continue; // TS check

    const diff = Math.abs(r1.distance - r2.distance);

    if (diff < minDiff) {
      minDiff = diff;

      // 経路の詳細情報（エレベーター有無など）を取得
      const hostPathDetails = getPathDetails(graph, r1.path);
      const guestPathDetails = getPathDetails(graph, r2.path);

      best = {
        host: {
          start: node1,
          end: center,
          path: r1.path,
          pathDetails: hostPathDetails, // 詳細を追加
          cost: r1.distance,
        },
        guest: {
          start: node2,
          end: center,
          path: r2.path,
          pathDetails: guestPathDetails, // 詳細を追加
          cost: r2.distance,
        },
        meetingPoint: center,
        totalCost: r1.distance + r2.distance,
      };
    }
  }

  return best;
}

/* ===============================
   Bedrock Time Estimation
================================ */

async function estimateTimeWithBedrock(input: BedrockInput): Promise<BedrockTimeResult> {
  // ★対策プロンプト: Markdown禁止とRAW JSONの強制を強調
  const prompt = `
  You are an expert scheduling algorithm.
  Estimate arrival and meeting times with SECOND-level precision.

  INPUT DATA:
  ${JSON.stringify(input, null, 2)}

  CALCULATION RULES:
  1. Base Time: Convert total cost to seconds (10 cost = 1 second).
  2. Edge Penalties (Check "pathDetails"):
     - IF type == "elevator": Add +45 seconds PER ELEVATOR (waiting/boarding time).
     - IF type == "escalator": Add +10 seconds safety buffer.
  3. Congestion Multiplier:
     - Morning (7-9)/Evening (17-19): x1.2 to x1.5
     - Other times: x1.0 to x1.1
  4. Final Calculation: (Base Time + Penalties) * Multiplier.

  OUTPUT FORMAT GUIDELINES:
  - IMPORTANT: Return RAW JSON only.
  - Do NOT use Markdown code blocks (no \`\`\`json).
  - Do NOT include any introductory text or explanations.
  - Timestamps must be ISO8601 with seconds.

  Desired JSON Structure:
  {
    "hostArrivalTime": "ISO8601",
    "guestArrivalTime": "ISO8601",
    "meetingTime": "ISO8601",
    "assumptions": {
      "elevatorCount": "Host: X, Guest: Y",
      "addedPenaltySeconds": 90,
      "congestionLevel": "low|normal|high"
    }
  }
  `;

  const command = new InvokeModelCommand({
    modelId: process.env.MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
        // ★対策: Assistantの出力を '{' で始めさせることでJSONを強制する（Prefill）
        {
          role: "assistant",
          content: [{ text: "{" }],
        },
      ],
      inferenceConfig: {
        stopSequences: ["}"],
      },
    }),
  });

  const response = await bedrock.send(command);
  const decoded = JSON.parse(new TextDecoder().decode(response.body));

  // Prefillで '{' を入力済みなので、モデルの回答はそれ以降の文字列になる
  // そのため、手動で '{' を結合する
  let rawText =
    decoded.output?.message?.content?.map((c: { text?: string }) => c.text).join("") ?? "";
  rawText = "{" + rawText;

  // ★対策: それでもMarkdownが含まれていた場合の最終防壁
  // ```json や ``` を正規表現で削除する
  const cleanJson = rawText
    .replace(/```json/gi, "") // ```json (大文字小文字無視) を削除
    .replace(/```/g, "") // 残りの ``` を削除
    .trim(); // 前後の空白削除

  try {
    return JSON.parse(cleanJson);
  } catch {
    console.error("JSON Parse Error. Raw text:", rawText);
    console.error("Cleaned text:", cleanJson);
    throw new Error("Failed to parse Bedrock response");
  }
}

/* ===============================
   Lambda Handler
================================ */

export const handler = async (event: BedrockHandlerEvent) => {
  try {
    const tableName = process.env.TABLE_NAME;
    const { endpoints } = event;

    if (!tableName) throw new Error("TABLE_NAME is not set");
    if (!Array.isArray(endpoints) || endpoints.length < 2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "endpoints must have 2 elements" }),
      };
    }

    /* --- Fetch edges --- */
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: "MAP#Umeda" },
        ":sk": { S: "EDGE#" },
      },
    });

    const response = await dynamo.send(command);
    const graph = buildGraph(response.Items ?? []);

    /* --- Pathfinding --- */
    const hostNode = String(endpoints[0]);
    const guestNode = String(endpoints[1]);

    const result = findMeetingPoint(graph, hostNode, guestNode);
    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No meeting point found" }),
      };
    }

    /* --- Bedrock Input --- */
    // エッジの詳細情報（pathDetails）を含めてLLMに渡す
    const bedrockInput: BedrockInput = {
      currentDatetime: new Date().toISOString(),
      timezone: "Asia/Tokyo",
      host: {
        cost: result.host.cost,
        pathDetails: result.host.pathDetails, // エレベーター情報など
      },
      guest: {
        cost: result.guest.cost,
        pathDetails: result.guest.pathDetails, // エレベーター情報など
      },
      meetingPoint: result.meetingPoint,
    };

    const timeResult = await estimateTimeWithBedrock(bedrockInput);

    /* --- Response --- */
    return {
      statusCode: 200,
      body: JSON.stringify({
        host: {
          ...result.host,
          arrivalTime: timeResult.hostArrivalTime,
        },
        guest: {
          ...result.guest,
          arrivalTime: timeResult.guestArrivalTime,
        },
        meetingPoint: result.meetingPoint,
        meetingTime: timeResult.meetingTime,
        totalCost: result.totalCost,
        assumptions: timeResult.assumptions,
      }),
    };
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
