import { useEffect } from "react";
import { useWallet as useWalletProvider } from "@/components/wallet-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useWalletWithUser() {
  const wallet = useWalletProvider();
  const queryClient = useQueryClient();

  // Get or create user when wallet connects
  const { data: user, error } = useQuery({
    queryKey: [`/api/users/${wallet.walletAddress}`],
    enabled: !!wallet.walletAddress,
    retry: false, // Don't retry on 404, we'll create the user instead
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { username: string; walletAddress: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${wallet.walletAddress}`] });
    },
  });

  const ensureUser = async () => {
    if (wallet.walletAddress && !user) {
      await createUserMutation.mutateAsync({
        username: wallet.walletAddress.slice(0, 8),
        walletAddress: wallet.walletAddress,
      });
    }
  };

  // Auto-create user when wallet connects and user doesn't exist (404 error)
  useEffect(() => {
    if (wallet.walletAddress && error && !user && !createUserMutation.isPending) {
      // Check if error is 404 (user not found)
      const errorResponse = error as any;
      if (errorResponse?.status === 404 || errorResponse?.message?.includes('404')) {
        console.log("User not found, creating new user...");
        createUserMutation.mutate({
          username: wallet.walletAddress.slice(0, 8),
          walletAddress: wallet.walletAddress,
        });
      }
    }
  }, [wallet.walletAddress, error, user, createUserMutation]);

  return {
    ...wallet,
    user,
    ensureUser,
    isCreatingUser: createUserMutation.isPending,
  };
}

// Alias for backward compatibility
export { useWalletWithUser as useWallet };
