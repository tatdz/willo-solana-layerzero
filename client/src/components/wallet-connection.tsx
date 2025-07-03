import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet-provider";
import { Badge } from "@/components/ui/badge";

export function WalletConnection() {
  const { connected, walletAddress } = useWallet();

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Wallet & OFT Balances</h2>
        <div className="flex items-center space-x-3">
          <Badge variant={connected ? "default" : "secondary"} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-sync-alt"></i>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Connected Wallet</h3>
            <Badge variant="secondary">Solflare</Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Wallet Address</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                {walletAddress ? truncateAddress(walletAddress) : "Not connected"}
              </code>
              {walletAddress && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-gray-600 h-8 w-8"
                >
                  <i className="fas fa-copy"></i>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Network Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-primary">Solana</span>
              </div>
              <p className="text-xs text-primary/80">Testnet</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-700">LayerZero</span>
              </div>
              <p className="text-xs text-emerald-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
