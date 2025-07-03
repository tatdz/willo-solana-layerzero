import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "./use-wallet";
import { InsertVault } from "@shared/schema";

export function useVaults() {
  const { user } = useWallet();
  const queryClient = useQueryClient();

  const { data: vaults = [], isLoading, error } = useQuery({
    queryKey: [`/api/users/${user?.id}/vaults`],
    enabled: !!user?.id,
  });

  const createVaultMutation = useMutation({
    mutationFn: async (vaultData: InsertVault) => {
      const response = await apiRequest("POST", "/api/vaults", vaultData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/vaults`] });
    },
  });

  const createVault = async (vaultData: Omit<InsertVault, 'userId'>) => {
    if (!user?.id) throw new Error("User not found");
    return createVaultMutation.mutateAsync({ ...vaultData, userId: user.id });
  };

  return {
    vaults,
    isLoading,
    error,
    createVault,
    isCreating: createVaultMutation.isPending,
  };
}
