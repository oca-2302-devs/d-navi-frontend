import { useMutation } from "@tanstack/react-query";

import client from "@/lib/amplify";

interface useRequestJoinVariables {
  roomId: string;
  guestNodeID: number;
}

export function useRequestJoin() {
  return useMutation({
    mutationFn: async ({ roomId, guestNodeID }: useRequestJoinVariables) => {
      const createdAt = new Date().toISOString();

      const { errors } = await client.models.SingleTable.create({
        PK: `ROOM#${roomId}`,
        SK: `REQUEST#${guestNodeID}`,
        entity: "REQUEST",
        status: "PENDING",
        createdAt,
        updatedAt: createdAt,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60,
      });

      if (errors) {
        throw new Error(`Failed to request join: ${JSON.stringify(errors)}`);
      }

      return { ok: true, status: "PENDING" };
    },
  });
}
