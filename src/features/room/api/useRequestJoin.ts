import { useMutation } from "@tanstack/react-query";

import { requestJoin } from "@/graphql/mutations";
import client from "@/lib/amplify";

interface useRequestJoinVariables {
  roomId: string;
  guestNodeID: number;
}

export function useRequestJoin() {
  return useMutation({
    mutationFn: async ({ roomId, guestNodeID }: useRequestJoinVariables) => {
      const response = await client.graphql({
        query: requestJoin,
        variables: { roomId, guestNodeID },
      });
      // @ts-ignore - response type is not fully typed without codegen
      return response.data.createRoom;
    },
  });
}
