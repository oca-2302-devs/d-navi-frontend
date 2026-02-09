import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/amplify";
import { updateMap } from "@/graphql/mutations";

export function useUpdateMap() {
  const queryClient = useQueryClient();

  return useMutation({
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
