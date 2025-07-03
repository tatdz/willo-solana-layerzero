import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./use-wallet";
import { InsertOftToken } from "@shared/schema";

export function useOftTokens() {
  const { user } = useWallet();
  const queryClient = useQueryClient();

  const { data: tokens = [], isLoading, error } = useQuery({
    queryKey: [`/api/users/${user?.id}/oft-tokens`],
    enabled: !!user?.id,
  });

  const createTokenMutation = useMutation({
    mutationFn: async (tokenData: InsertOftToken) => {
      const response = await apiRequest("POST", "/api/oft-tokens", tokenData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/oft-tokens`] });
    },
  });

  const updateBalanceMutation = useMutation({
    mutationFn: async ({ tokenId, balance }: { tokenId: number; balance: string }) => {
      const response = await apiRequest("PATCH", `/api/oft-tokens/${tokenId}/balance`, { balance });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/oft-tokens`] });
    },
  });

  const createToken = async (tokenData: Omit<InsertOftToken, 'userId'>) => {
    if (!user?.id) throw new Error("User not found");
    return createTokenMutation.mutateAsync({ ...tokenData, userId: user.id });
  };

  const updateBalance = async (tokenId: number, balance: string) => {
    return updateBalanceMutation.mutateAsync({ tokenId, balance });
  };

  return {
    tokens,
    isLoading,
    error,
    createToken,
    updateBalance,
    isCreating: createTokenMutation.isPending,
    isUpdating: updateBalanceMutation.isPending,
  };
}
