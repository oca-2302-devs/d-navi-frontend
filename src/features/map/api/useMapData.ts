import { useQuery } from "@tanstack/react-query";
import client from "@/lib/amplify";
import { listMaps } from "@/graphql/queries";

export function useMapData() {
  return useQuery({
    queryKey: ["maps"],
    queryFn: async () => {
      const response = await client.graphql({
        query: listMaps,
      });
      // @ts-ignore - response type is not fully typed without codegen
      return response.data.listMaps.items;
    },
  });
}
