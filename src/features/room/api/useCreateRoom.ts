import { useMutation } from "@tanstack/react-query";
import client from "@/lib/amplify";
import { createRoom } from "@/graphql/mutations";

interface CreateRoomVariables {
  hostNodeID: number;
}

export function useCreateRoom() {
  return useMutation({
    mutationFn: async ({ hostNodeID }: CreateRoomVariables) => {
      const response = await client.graphql({
        query: createRoom,
        variables: { hostNodeID },
      });
      // @ts-ignore - response type is not fully typed without codegen
      return response.data.createRoom;
    },
  });
}
