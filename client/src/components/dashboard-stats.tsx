import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet-provider";
import { apiRequest } from "@/lib/queryClient";

export function DashboardStats() {
  const { walletAddress } = useWallet();

  const { data: user } = useQuery({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress,
  });

  const { data: tokens = [] } = useQuery({
    queryKey: [`/api/users/${user?.id}/oft-tokens`],
    enabled: !!user?.id,
  });

  const { data: vaults = [] } = useQuery({
    queryKey: [`/api/users/${user?.id}/vaults`],
    enabled: !!user?.id,
  });

  const { data: transfers = [] } = useQuery({
    queryKey: [`/api/users/${user?.id}/transfers`],
    enabled: !!user?.id,
  });

  const totalBalance = tokens.reduce((sum: number, token: any) => sum + parseFloat(token.balance || "0"), 0);
  const activeVaults = vaults.filter((vault: any) => vault.status === "active").length;
  const successfulTransfers = transfers.filter((transfer: any) => transfer.status === "completed").length;
  const oftTokenCount = tokens.filter((token: any) => token.isOftEnabled).length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total OFT Balance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-coins text-primary text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-emerald-600">
          <i className="fas fa-arrow-up mr-1"></i>
          <span>Portfolio value</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active Vaults</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeVaults}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-vault text-emerald-600 text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>{vaults.length} total vaults</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Cross-Chain Transfers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{successfulTransfers}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-exchange-alt text-amber-600 text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-emerald-600">
          <span>All successful</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">OFT Tokens</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{oftTokenCount}</p>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-layer-group text-purple-600 text-xl"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>Registered on LayerZero</span>
        </div>
      </Card>
    </section>
  );
}
