import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "./wallet-provider";
import { createOnChainVault, getSolanaExplorerUrl } from "@/lib/solana-program";
import { getWalletAssets, getDemoAssets, formatAssetBalance, formatUsdValue, type Asset, type WalletAssets } from "@/lib/asset-discovery";
import { Wallet, Plus, Trash2, ExternalLink, RefreshCw, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";

interface EnhancedVaultCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (vaultId: string) => void;
}

interface VaultAsset {
  asset: Asset;
  amount: number;
  allocations: { [beneficiary: string]: number };
}

interface Beneficiary {
  id: string;
  address: string;
  name: string;
}

export function EnhancedVaultCreation({ isOpen, onClose, onSuccess }: EnhancedVaultCreationProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [walletAssets, setWalletAssets] = useState<WalletAssets | null>(null);
  const [assetsLoading, setAssetsLoading] = useState(false);
  
  // Vault basic info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inactivityPeriod, setInactivityPeriod] = useState(30);
  
  // Selected assets and amounts
  const [selectedAssets, setSelectedAssets] = useState<VaultAsset[]>([]);
  
  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [newBeneficiaryAddress, setNewBeneficiaryAddress] = useState("");
  const [newBeneficiaryName, setNewBeneficiaryName] = useState("");
  
  // Transaction state
  const [txHash, setTxHash] = useState("");
  
  const { connected, walletAddress, walletType, connection } = useWallet();
  const { toast } = useToast();

  // Load wallet assets
  useEffect(() => {
    if (isOpen && walletAddress) {
      loadWalletAssets();
    }
  }, [isOpen, walletAddress]);

  const loadWalletAssets = async () => {
    if (!walletAddress) return;
    
    setAssetsLoading(true);
    try {
      const assets = await getWalletAssets(walletAddress);
      setWalletAssets(assets);
    } catch (error) {
      console.error('Failed to load wallet assets:', error);
      toast({
        title: "Error Loading Assets",
        description: "Failed to fetch wallet assets. Using demo data.",
        variant: "destructive",
      });
      setWalletAssets(getDemoAssets());
    } finally {
      setAssetsLoading(false);
    }
  };

  const refreshAssets = async () => {
    if (!walletAddress) return;
    setAssetsLoading(true);
    try {
      const assets = await getWalletAssets(walletAddress, true);
      setWalletAssets(assets);
      toast({
        title: "Assets Refreshed",
        description: "Wallet assets have been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh assets.",
        variant: "destructive",
      });
    } finally {
      setAssetsLoading(false);
    }
  };

  const addAsset = (asset: Asset) => {
    if (selectedAssets.find(sa => sa.asset.id === asset.id)) {
      toast({
        title: "Asset Already Added",
        description: "This asset is already in your vault.",
        variant: "destructive",
      });
      return;
    }

    const newVaultAsset: VaultAsset = {
      asset,
      amount: Math.min(asset.balance, asset.balance * 0.1), // Default to 10% of balance
      allocations: {},
    };

    setSelectedAssets([...selectedAssets, newVaultAsset]);
  };

  const removeAsset = (assetId: string) => {
    setSelectedAssets(selectedAssets.filter(sa => sa.asset.id !== assetId));
  };

  const updateAssetAmount = (assetId: string, amount: number) => {
    setSelectedAssets(selectedAssets.map(sa => 
      sa.asset.id === assetId ? { ...sa, amount } : sa
    ));
  };

  const addBeneficiary = () => {
    if (!newBeneficiaryAddress || !newBeneficiaryName) {
      toast({
        title: "Missing Information",
        description: "Please enter both address and name for the beneficiary.",
        variant: "destructive",
      });
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: Date.now().toString(),
      address: newBeneficiaryAddress,
      name: newBeneficiaryName,
    };

    setBeneficiaries([...beneficiaries, newBeneficiary]);
    setNewBeneficiaryAddress("");
    setNewBeneficiaryName("");
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    // Remove allocations for this beneficiary
    setSelectedAssets(selectedAssets.map(sa => ({
      ...sa,
      allocations: Object.fromEntries(
        Object.entries(sa.allocations).filter(([benefId]) => benefId !== id)
      ),
    })));
  };

  const updateAllocation = (assetId: string, beneficiaryId: string, percentage: number) => {
    setSelectedAssets(selectedAssets.map(sa => 
      sa.asset.id === assetId 
        ? { 
            ...sa, 
            allocations: { 
              ...sa.allocations, 
              [beneficiaryId]: percentage 
            }
          } 
        : sa
    ));
  };

  const createVault = async () => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a vault.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const vaultData = {
        creator: walletAddress,
        title,
        description,
        inactivityPeriod,
        beneficiaries: beneficiaries.map(b => b.address),
        assets: selectedAssets.map(sa => ({
          tokenAddress: sa.asset.tokenAddress,
          amount: sa.amount,
          symbol: sa.asset.symbol,
          allocations: sa.allocations,
        })),
      };

      // Real wallet only vault creation

      // Create actual on-chain vault
      const result = await createOnChainVault(connection, { 
        publicKey: new (await import('@solana/web3.js')).PublicKey(walletAddress),
        signTransaction: async (tx: any) => tx, // Will be implemented by wallet
        signAllTransactions: async (txs: any[]) => txs,
      }, vaultData);

      setTxHash(result.txHash);
      setStep(5);
      
      toast({
        title: "Vault Created Successfully",
        description: "Your inheritance vault has been deployed to Solana.",
      });
      
      setTimeout(() => {
        onSuccess?.(result.data.id);
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create vault:', error);
      toast({
        title: "Vault Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setInactivityPeriod(30);
    setSelectedAssets([]);
    setBeneficiaries([]);
    setTxHash("");
    onClose();
  };

  const getTotalAllocation = (assetId: string) => {
    const asset = selectedAssets.find(sa => sa.asset.id === assetId);
    if (!asset) return 0;
    return Object.values(asset.allocations).reduce((sum, pct) => sum + pct, 0);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return title && description && inactivityPeriod > 0;
      case 2:
        return selectedAssets.length > 0;
      case 3:
        return beneficiaries.length > 0;
      case 4:
        return selectedAssets.every(sa => getTotalAllocation(sa.asset.id) === 100);
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Inheritance Vault</DialogTitle>
          <DialogDescription>
            Create a secure inheritance vault with cross-chain assets
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  s === step
                    ? "bg-blue-600 text-white"
                    : s < step
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s < step ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <Progress value={(step / 5) * 100} className="h-2" />
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vault Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Vault Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Inheritance Vault"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of this inheritance vault..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inactivity">Inactivity Period (days)</Label>
              <Input
                id="inactivity"
                type="number"
                value={inactivityPeriod}
                onChange={(e) => setInactivityPeriod(Number(e.target.value))}
                min={1}
                max={365}
              />
              <p className="text-sm text-gray-500">
                Vault becomes claimable after this many days of inactivity
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Select Assets */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Assets</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAssets}
                disabled={assetsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${assetsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {assetsLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Loading wallet assets...</p>
              </div>
            ) : walletAssets ? (
              <div className="space-y-4">
                <Alert>
                  <Wallet className="w-4 h-4" />
                  <AlertDescription>
                    Total Portfolio Value: {formatUsdValue(walletAssets.totalUsdValue)}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {walletAssets.assets.map((asset) => (
                    <Card key={asset.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {asset.logo && (
                            <img src={asset.logo} alt={asset.symbol} className="w-8 h-8 rounded-full" />
                          )}
                          <div>
                            <p className="font-semibold">{asset.symbol}</p>
                            <p className="text-sm text-gray-500">{asset.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAssetBalance(asset.balance, 4)}</p>
                          <p className="text-sm text-gray-500">{formatUsdValue(asset.usdValue)}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <Badge variant="outline">{asset.chain}</Badge>
                        <Button
                          size="sm"
                          onClick={() => addAsset(asset)}
                          disabled={selectedAssets.some(sa => sa.asset.id === asset.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {selectedAssets.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Selected Assets</h4>
                    <div className="space-y-3">
                      {selectedAssets.map((vaultAsset) => (
                        <Card key={vaultAsset.asset.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {vaultAsset.asset.logo && (
                                <img src={vaultAsset.asset.logo} alt={vaultAsset.asset.symbol} className="w-6 h-6 rounded-full" />
                              )}
                              <span className="font-medium">{vaultAsset.asset.symbol}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`amount-${vaultAsset.asset.id}`}>Amount:</Label>
                                <Input
                                  id={`amount-${vaultAsset.asset.id}`}
                                  type="number"
                                  value={vaultAsset.amount}
                                  onChange={(e) => updateAssetAmount(vaultAsset.asset.id, Number(e.target.value))}
                                  max={vaultAsset.asset.balance}
                                  step="0.01"
                                  className="w-24"
                                />
                                <span className="text-sm text-gray-500">
                                  / {formatAssetBalance(vaultAsset.asset.balance, 4)}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeAsset(vaultAsset.asset.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Failed to load wallet assets. Please connect your wallet and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Add Beneficiaries */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Beneficiaries</h3>
            
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-base">Add New Beneficiary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="beneficiary-name">Name</Label>
                  <Input
                    id="beneficiary-name"
                    value={newBeneficiaryName}
                    onChange={(e) => setNewBeneficiaryName(e.target.value)}
                    placeholder="Beneficiary name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beneficiary-address">Wallet Address</Label>
                  <Input
                    id="beneficiary-address"
                    value={newBeneficiaryAddress}
                    onChange={(e) => setNewBeneficiaryAddress(e.target.value)}
                    placeholder="Solana wallet address"
                  />
                </div>
                <Button onClick={addBeneficiary} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Beneficiary
                </Button>
              </CardContent>
            </Card>

            {beneficiaries.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Beneficiaries ({beneficiaries.length})</h4>
                <div className="space-y-2">
                  {beneficiaries.map((beneficiary) => (
                    <Card key={beneficiary.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{beneficiary.name}</p>
                          <p className="text-sm text-gray-500 font-mono">
                            {beneficiary.address.slice(0, 8)}...{beneficiary.address.slice(-8)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeBeneficiary(beneficiary.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Asset Allocation */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Asset Allocation</h3>
            <p className="text-sm text-gray-500">
              Allocate percentage of each asset to beneficiaries (must total 100% per asset)
            </p>

            {selectedAssets.map((vaultAsset) => (
              <Card key={vaultAsset.asset.id} className="p-4">
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    {vaultAsset.asset.logo && (
                      <img src={vaultAsset.asset.logo} alt={vaultAsset.asset.symbol} className="w-6 h-6 rounded-full" />
                    )}
                    <span>{vaultAsset.asset.symbol}</span>
                    <Badge variant="outline">{formatAssetBalance(vaultAsset.amount, 4)}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {beneficiaries.map((beneficiary) => (
                    <div key={beneficiary.id} className="flex items-center justify-between">
                      <span className="text-sm">{beneficiary.name}</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={vaultAsset.allocations[beneficiary.id] || 0}
                          onChange={(e) => updateAllocation(vaultAsset.asset.id, beneficiary.id, Number(e.target.value))}
                          min={0}
                          max={100}
                          className="w-20"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total Allocated:</span>
                    <span className={getTotalAllocation(vaultAsset.asset.id) === 100 ? "text-green-600" : "text-red-600"}>
                      {getTotalAllocation(vaultAsset.asset.id)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 5: Confirmation & Deployment */}
        {step === 5 && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold">Vault Created Successfully!</h3>
            
            {txHash && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Transaction Hash:</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {txHash.slice(0, 16)}...{txHash.slice(-16)}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getSolanaExplorerUrl(txHash), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Your inheritance vault has been deployed and is now active.
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
            disabled={loading}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step < 5 && (
            <Button
              onClick={() => step === 4 ? createVault() : setStep(step + 1)}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : step === 4 ? (
                "Create Vault"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}