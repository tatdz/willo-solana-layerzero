import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "./wallet-provider";
import { useVaults } from "../hooks/use-vaults";
import { useOftTokens } from "../hooks/use-oft-tokens";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

interface VaultCreationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VaultAsset {
  tokenId: number;
  amount: string;
}

export function VaultCreation({ isOpen, onClose }: VaultCreationProps) {
  const { createVault } = useVaults();
  const { tokens } = useOftTokens();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'basic' | 'assets' | 'beneficiaries' | 'review'>('basic');
  const [vaultData, setVaultData] = useState({
    name: '',
    description: '',
    status: 'pending' as const
  });
  const [selectedAssets, setSelectedAssets] = useState<VaultAsset[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<string[]>(['']);
  const [newBeneficiary, setNewBeneficiary] = useState('');

  const oftTokens = (tokens as any[])?.filter((token: any) => token.isOftEnabled) || [];

  const handleAddAsset = () => {
    setSelectedAssets(prev => [...prev, { tokenId: 0, amount: '' }]);
  };

  const handleRemoveAsset = (index: number) => {
    setSelectedAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssetChange = (index: number, field: keyof VaultAsset, value: string) => {
    setSelectedAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, [field]: field === 'tokenId' ? parseInt(value) : value } : asset
    ));
  };

  const handleAddBeneficiary = () => {
    if (newBeneficiary.trim() && !beneficiaries.includes(newBeneficiary.trim())) {
      setBeneficiaries(prev => [...prev.filter(b => b.trim()), newBeneficiary.trim()]);
      setNewBeneficiary('');
    }
  };

  const handleRemoveBeneficiary = (index: number) => {
    setBeneficiaries(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalValue = () => {
    return selectedAssets.reduce((total, asset) => {
      const token = oftTokens.find((t: any) => t.id === asset.tokenId);
      if (token && asset.amount) {
        return total + (parseFloat(asset.amount) * 1.47); // Mock USD value
      }
      return total;
    }, 0);
  };

  const handleCreateVault = async () => {
    try {
      const totalValue = calculateTotalValue();
      const validBeneficiaries = beneficiaries.filter(b => b.trim());
      
      await createVault({
        name: vaultData.name,
        description: vaultData.description,
        status: validBeneficiaries.length > 0 && selectedAssets.length > 0 ? 'active' : 'pending',
        totalValue: totalValue.toString(),
        beneficiaries: validBeneficiaries
      });

      toast({
        title: "Vault Created",
        description: `Successfully created vault "${vaultData.name}"`,
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: `Failed to create vault: ${error}`,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setStep('basic');
    setVaultData({ name: '', description: '', status: 'pending' });
    setSelectedAssets([]);
    setBeneficiaries(['']);
    setNewBeneficiary('');
    onClose();
  };

  const canProceedToAssets = vaultData.name.trim() !== '';
  const canProceedToBeneficiaries = selectedAssets.length > 0 && selectedAssets.every(a => a.tokenId && a.amount);
  const canProceedToReview = beneficiaries.some(b => b.trim());
  const canCreateVault = canProceedToAssets && canProceedToBeneficiaries && canProceedToReview;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Inheritance Vault</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center space-x-4 mb-6">
          {['basic', 'assets', 'beneficiaries', 'review'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepName 
                  ? 'bg-primary text-white' 
                  : index < ['basic', 'assets', 'beneficiaries', 'review'].indexOf(step)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {index < ['basic', 'assets', 'beneficiaries', 'review'].indexOf(step) ? '✓' : index + 1}
              </div>
              {index < 3 && <div className="w-8 h-0.5 bg-gray-200"></div>}
            </div>
          ))}
        </div>
        
        {step === 'basic' && (
          <div className="space-y-6">
            <Card className="p-4 bg-emerald-50 border-emerald-200">
              <div className="flex items-start space-x-3">
                <i className="fas fa-vault text-emerald-600 mt-0.5"></i>
                <div className="text-sm">
                  <p className="font-medium text-emerald-800">Inheritance Vault</p>
                  <p className="text-emerald-700 mt-1">
                    Securely store your OFT tokens and designate beneficiaries for inheritance.
                  </p>
                </div>
              </div>
            </Card>

            <div>
              <Label htmlFor="vault-name">Vault Name *</Label>
              <Input
                id="vault-name"
                value={vaultData.name}
                onChange={(e) => setVaultData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Family Vault"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="vault-description">Description</Label>
              <Textarea
                id="vault-description"
                value={vaultData.description}
                onChange={(e) => setVaultData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this vault..."
                className="mt-2"
                rows={3}
              />
            </div>

            <Button
              onClick={() => setStep('assets')}
              disabled={!canProceedToAssets}
              className="w-full gradient-primary text-white hover:opacity-90"
            >
              Continue to Assets
            </Button>
          </div>
        )}

        {step === 'assets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add OFT Assets</h3>
              <Button onClick={handleAddAsset} size="sm" variant="outline">
                <i className="fas fa-plus mr-2"></i>Add Asset
              </Button>
            </div>

            {selectedAssets.length === 0 ? (
              <Card className="p-6 text-center border-dashed">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-coins text-gray-400"></i>
                </div>
                <p className="text-gray-500 mb-4">No assets added yet</p>
                <Button onClick={handleAddAsset} size="sm">
                  <i className="fas fa-plus mr-2"></i>Add Your First Asset
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {selectedAssets.map((asset, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label>Token</Label>
                        <Select 
                          value={asset.tokenId.toString()} 
                          onValueChange={(value) => handleAssetChange(index, 'tokenId', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select OFT token" />
                          </SelectTrigger>
                          <SelectContent>
                            {oftTokens.map((token: any) => (
                              <SelectItem key={token.id} value={token.id.toString()}>
                                {token.name} ({token.symbol}) - {parseFloat(token.balance).toLocaleString()} available
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={asset.amount}
                          onChange={(e) => handleAssetChange(index, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveAsset(index)}
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={() => setStep('basic')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep('beneficiaries')}
                disabled={!canProceedToBeneficiaries}
                className="flex-1 gradient-primary text-white hover:opacity-90"
              >
                Continue to Beneficiaries
              </Button>
            </div>
          </div>
        )}

        {step === 'beneficiaries' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Beneficiaries</h3>
              <p className="text-sm text-gray-600">Specify wallet addresses that will inherit this vault</p>
            </div>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={newBeneficiary}
                  onChange={(e) => setNewBeneficiary(e.target.value)}
                  placeholder="Enter wallet address"
                  className="flex-1"
                />
                <Button onClick={handleAddBeneficiary} disabled={!newBeneficiary.trim()}>
                  <i className="fas fa-plus"></i>
                </Button>
              </div>

              {beneficiaries.filter(b => b.trim()).map((beneficiary, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-purple-600"></i>
                    </div>
                    <code className="text-sm">{beneficiary.slice(0, 8)}...{beneficiary.slice(-8)}</code>
                  </div>
                  <Button 
                    onClick={() => handleRemoveBeneficiary(index)}
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button onClick={() => setStep('assets')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep('review')}
                disabled={!canProceedToReview}
                className="flex-1 gradient-primary text-white hover:opacity-90"
              >
                Review & Create
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Vault Details</h3>

            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Basic Information</h4>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{vaultData.name}</span>
                    </div>
                    {vaultData.description && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Description:</span>
                        <span className="text-right max-w-xs">{vaultData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Assets ({selectedAssets.length})</h4>
                  <div className="mt-2 space-y-2">
                    {selectedAssets.map((asset, index) => {
                      const token = oftTokens.find((t: any) => t.id === asset.tokenId);
                      return (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{token?.name} ({token?.symbol})</span>
                          <span>{asset.amount} tokens</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Value:</span>
                      <span>${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Beneficiaries ({beneficiaries.filter(b => b.trim()).length})</h4>
                  <div className="mt-2 space-y-1">
                    {beneficiaries.filter(b => b.trim()).map((beneficiary, index) => (
                      <div key={index} className="text-sm font-mono">
                        {beneficiary.slice(0, 8)}...{beneficiary.slice(-8)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex space-x-3">
              <Button onClick={() => setStep('beneficiaries')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreateVault}
                disabled={!canCreateVault}
                className="flex-1 gradient-emerald text-white hover:opacity-90"
              >
                <i className="fas fa-vault mr-2"></i>
                Create Vault
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}