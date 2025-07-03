import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "./wallet-provider";
import { formatUsdValue, formatAssetBalance, type Asset } from "@/lib/asset-discovery";
import { isVaultClaimable, claimInheritance, getSolanaExplorerUrl } from "@/lib/solana-program";
import { CheckCircle, Clock, Shield, ExternalLink, Gift, Wallet, AlertCircle } from "lucide-react";

interface InheritanceVault {
  id: string;
  title: string;
  creator: string;
  createdAt: Date;
  lastActivity: Date;
  inactivityPeriod: number;
  status: 'active' | 'triggered' | 'claimed';
  assets: VaultAsset[];
  beneficiaryAllocation: number; // percentage for this beneficiary
}

interface VaultAsset {
  symbol: string;
  amount: number;
  usdValue: number;
  allocation: number; // percentage for this beneficiary
}

export function BeneficiaryPortal() {
  const [walletToCheck, setWalletToCheck] = useState("");
  const [inheritanceVaults, setInheritanceVaults] = useState<InheritanceVault[]>([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  
  const { connected, walletAddress, walletType, connection } = useWallet();
  const { toast } = useToast();

  // Demo data for beneficiary portal
  const demoVaults: InheritanceVault[] = [
    {
      id: "vault_demo_1",
      title: "Family Emergency Fund",
      creator: "John Smith",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      inactivityPeriod: 30,
      status: 'triggered',
      beneficiaryAllocation: 50,
      assets: [
        { symbol: 'SOL', amount: 25.5, usdValue: 2550, allocation: 50 },
        { symbol: 'USDC', amount: 5000, usdValue: 5000, allocation: 50 },
        { symbol: 'CUSTOM', amount: 1000, usdValue: 150, allocation: 50 }
      ]
    },
    {
      id: "vault_demo_2", 
      title: "Education Fund",
      creator: "Sarah Johnson",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      inactivityPeriod: 30,
      status: 'active',
      beneficiaryAllocation: 100,
      assets: [
        { symbol: 'ETH-OFT', amount: 2.5, usdValue: 6250, allocation: 100 }
      ]
    },
    {
      id: "vault_demo_3",
      title: "Business Assets",
      creator: "Michael Brown", 
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
      lastActivity: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), // 65 days ago
      inactivityPeriod: 60,
      status: 'triggered',
      beneficiaryAllocation: 25,
      assets: [
        { symbol: 'BTC-OFT', amount: 0.1, usdValue: 4500, allocation: 25 },
        { symbol: 'MATIC-OFT', amount: 10000, usdValue: 8500, allocation: 25 }
      ]
    }
  ];

  useEffect(() => {
    if (walletAddress) {
      setWalletToCheck(walletAddress);
      loadInheritanceVaults(walletAddress);
    }
  }, [walletAddress]);

  const loadInheritanceVaults = async (address: string) => {
    if (!address) return;
    
    setLoading(true);
    try {
      // Query the blockchain for vaults where the current wallet is listed as a beneficiary
      setInheritanceVaults([]);
    } catch (error) {
      console.error('Failed to load inheritance vaults:', error);
      toast({
        title: "Error Loading Vaults",
        description: "Failed to fetch inheritance vaults.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkInheritanceStatus = () => {
    if (!walletToCheck) {
      toast({
        title: "Enter Wallet Address",
        description: "Please enter a wallet address to check for inheritance.",
        variant: "destructive",
      });
      return;
    }
    loadInheritanceVaults(walletToCheck);
  };

  const claimVault = async (vault: InheritanceVault) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected", 
        description: "Please connect your wallet to claim inheritance.",
        variant: "destructive",
      });
      return;
    }

    setClaiming(vault.id);
    try {
      // Real blockchain claiming would happen here
      toast({
        title: "Feature Coming Soon", 
        description: "Real blockchain claiming will be implemented with the deployed smart contract.",
      });
    } catch (error) {
      console.error('Failed to claim inheritance:', error);
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setClaiming(null);
    }
  };

  const getStatusBadge = (vault: InheritanceVault) => {
    const daysSinceActivity = Math.floor((Date.now() - vault.lastActivity.getTime()) / (24 * 60 * 60 * 1000));
    const canClaim = daysSinceActivity >= vault.inactivityPeriod;
    
    if (vault.status === 'claimed') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Claimed</Badge>;
    } else if (canClaim || vault.status === 'triggered') {
      return <Badge variant="default" className="bg-green-100 text-green-700">Ready to Claim</Badge>;
    } else {
      return <Badge variant="outline">Active ({vault.inactivityPeriod - daysSinceActivity} days remaining)</Badge>;
    }
  };

  const getTotalValue = (assets: VaultAsset[]) => {
    return assets.reduce((sum, asset) => sum + (asset.usdValue * asset.allocation / 100), 0);
  };

  const canClaimVault = (vault: InheritanceVault) => {
    const daysSinceActivity = Math.floor((Date.now() - vault.lastActivity.getTime()) / (24 * 60 * 60 * 1000));
    return (daysSinceActivity >= vault.inactivityPeriod || vault.status === 'triggered') && vault.status !== 'claimed';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Gift className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Beneficiary Portal</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Check for inheritance vaults where you are listed as a beneficiary. 
          Claim your digital assets when the inheritance conditions are met.
        </p>
      </div>

      {/* Wallet Check Section */}
      {!connected && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Check Inheritance Status</span>
            </CardTitle>
            <CardDescription>
              Enter a wallet address to check for available inheritances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                value={walletToCheck}
                onChange={(e) => setWalletToCheck(e.target.value)}
                placeholder="Enter Solana wallet address"
              />
            </div>
            <Button 
              onClick={checkInheritanceStatus}
              disabled={loading || !walletToCheck}
              className="w-full"
            >
              {loading ? "Checking..." : "Check Inheritance"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Connected Wallet Status */}
      {connected && (
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            Connected as beneficiary: <code className="text-xs">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</code>
          </AlertDescription>
        </Alert>
      )}

      {/* Inheritance Vaults */}
      {inheritanceVaults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Available Inheritances</h2>
          
          <div className="grid gap-6">
            {inheritanceVaults.map((vault) => (
              <Card key={vault.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{vault.title}</CardTitle>
                      <CardDescription className="text-base">
                        From: {vault.creator} • Your allocation: {vault.beneficiaryAllocation}%
                      </CardDescription>
                    </div>
                    {getStatusBadge(vault)}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Vault Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Vault Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Created:</span>
                            <span>{vault.createdAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Activity:</span>
                            <span>{vault.lastActivity.toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Inactivity Period:</span>
                            <span>{vault.inactivityPeriod} days</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Your Share: {formatUsdValue(getTotalValue(vault.assets))}
                        </h4>
                        <div className="space-y-2">
                          {vault.assets.map((asset, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{asset.symbol}</span>
                                <div className="text-sm text-gray-500">
                                  {formatAssetBalance(asset.amount * asset.allocation / 100, 4)} 
                                  ({asset.allocation}% allocation)
                                </div>
                              </div>
                              <span className="font-semibold">
                                {formatUsdValue(asset.usdValue * asset.allocation / 100)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Claim Status</h4>
                        {vault.status === 'claimed' ? (
                          <Alert>
                            <CheckCircle className="w-4 h-4" />
                            <AlertDescription>
                              This inheritance has been claimed successfully.
                            </AlertDescription>
                          </Alert>
                        ) : canClaimVault(vault) ? (
                          <Alert>
                            <Gift className="w-4 h-4" />
                            <AlertDescription>
                              This inheritance is ready to claim. The creator has been inactive for the required period.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert>
                            <Clock className="w-4 h-4" />
                            <AlertDescription>
                              This inheritance is not yet claimable. The creator must remain inactive for the full inactivity period.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-3">
                        {canClaimVault(vault) && (
                          <Button
                            onClick={() => claimVault(vault)}
                            disabled={claiming === vault.id}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {claiming === vault.id ? "Claiming..." : "Claim Inheritance"}
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(getSolanaExplorerUrl(vault.id), '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Inheritances Found */}
      {!loading && inheritanceVaults.length === 0 && walletToCheck && (
        <Card className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inheritances Found</h3>
          <p className="text-gray-600">
            No inheritance vaults were found for this wallet address. 
            If you believe this is an error, please verify the wallet address.
          </p>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How Inheritance Claims Work</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-2">
            <p>• <strong>Automatic Triggering:</strong> Vaults become claimable after the creator's inactivity period expires</p>
            <p>• <strong>Secure Claims:</strong> Only designated beneficiaries can claim their allocated portions</p>
            <p>• <strong>Cross-Chain Assets:</strong> OFT tokens can be claimed on any supported blockchain network</p>
            <p>• <strong>Transparent Process:</strong> All claims are recorded on the blockchain for complete transparency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}