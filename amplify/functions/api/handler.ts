import {
  createRoom,
  getRoom,
  getRequest,
  requestJoin,
  approveJoin,
  rejectJoin,
  getMapData,
  addDummyData,
  getMapNodes,
} from "./dynamo";

interface AppSyncArguments {
  pk?: string;
  skPrefix?: string;
  hostNodeID?: number;
  roomId?: string;
  guestNodeID?: number;
  hostToken?: string;
}

interface AppSyncEvent {
  info?: {
    fieldName: string;
  };
  arguments?: AppSyncArguments;
  // Fallback for manual testing or direct Lambda invocation
  pk?: string;
  fieldName?: string;
}

export const handler = async (event: AppSyncEvent) => {
  const field = event.info?.fieldName;
  const args = event.arguments ?? {};

  switch (field) {
    case "getMapData": {
      const pk = args.pk ?? "MAP#Umeda";
      return await getMapData(pk);
    }

    case "addDummyData": {
      return await addDummyData();
    }

    case "getMapNodes": {
      const pk = args.pk ?? "MAP#Umeda";
      // const skPrefix = args.skPrefix ?? "NODE#";
      return await getMapNodes(pk);
    }

    case "createRoom":
      if (args.hostNodeID === undefined) throw new Error("hostNodeID is required for createRoom");
      return await createRoom(args.hostNodeID);

    case "getRoom":
      if (!args.roomId) throw new Error("roomId is required for getRoom");
      return await getRoom(args.roomId);

    case "getRequest":
      if (!args.roomId) throw new Error("roomId is required for getRequest");
      return await getRequest(args.roomId);

    case "requestJoin":
      if (!args.roomId || args.guestNodeID === undefined)
        throw new Error("roomId and guestNodeID are required for requestJoin");
      return await requestJoin(args.roomId, args.guestNodeID);

    case "approveJoin":
      if (!args.roomId || !args.hostToken || args.hostNodeID === undefined)
        throw new Error("roomId, hostToken, and hostNodeID are required for approveJoin");
      return await approveJoin(args.roomId, args.hostToken, args.hostNodeID);

    case "rejectJoin":
      if (!args.roomId || !args.hostToken)
        throw new Error("roomId and hostToken are required for rejectJoin");
      return await rejectJoin(args.roomId, args.hostToken);

    default: {
      // 手動テスト用 fallback
      if (event.pk) return await getMapData(event.pk);

      // For manual testing invoking directly with arguments but no info
      // If we want to support calling this lambda directly without AppSync wrapping, we might need a way to specify 'field'
      // But standard way seems to be relying on info.fieldName.

      throw new Error(`Unknown fieldName: ${field}`);
    }
  }
};
