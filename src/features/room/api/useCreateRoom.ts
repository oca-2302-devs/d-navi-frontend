import { useMutation } from "@tanstack/react-query";

import client from "@/lib/amplify";

interface CreateRoomVariables {
  hostNodeID: number;
}

/**
 * ランダムなトークンを生成する（ブラウザ環境対応）
 */
function generateToken(prefix: string): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const base64url = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${prefix}_${base64url}`;
}

export function useCreateRoom() {
  return useMutation({
    mutationFn: async ({ hostNodeID }: CreateRoomVariables) => {
      const roomId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // 1時間後

      // ホストトークンを生成（クライアントに返す用）
      const hostToken = generateToken("host");

      const { errors } = await client.models.SingleTable.create({
        PK: `ROOM#${roomId}`,
        SK: "META",
        entity: "ROOM",
        roomId,
        status: "OPEN",
        guestLimit: 1,
        createdAt,
        updatedAt: createdAt,
        expiresAt,
        data: JSON.stringify({ hostNodeID, hostToken }),
      });

      if (errors) {
        throw new Error(`Failed to create room: ${JSON.stringify(errors)}`);
      }

      return {
        room: {
          roomId,
          status: "OPEN",
          meetupPoint: null,
          createdAt,
          updatedAt: createdAt,
          expiresAt,
        },
        hostToken,
      };
    },
  });
}
