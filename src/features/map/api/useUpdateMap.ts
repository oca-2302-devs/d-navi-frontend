import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMap } from "@/graphql/mutations";
import client from "@/lib/amplify";

export function useUpdateMap() {
  const queryClient = useQueryClient();

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (input: any) => {
      const response = await client.graphql({
        query: updateMap,
        variables: { input },
      });
      // @ts-ignore - response type is not fully typed without codegen
      return response.data.updateMap;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
    },
  });
}
