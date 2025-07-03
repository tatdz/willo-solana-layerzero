import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "./wallet-provider";
import { useOftTokens } from "../hooks/use-oft-tokens";
import { useState } from "react";
import { createSPLToken, generateRandomTokenConfig, requestAirdrop, TokenConfig } from "../lib/solana";
import { registerOFT } from "../lib/layerzero";
import { useToast } from "../hooks/use-toast";

interface OftTokenRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OftTokenRegistration({ isOpen, onClose }: OftTokenRegistrationProps) {
  const { connection, publicKey, signTransaction, signAllTransactions, walletType } = useWallet();
  const { createToken } = useOftTokens();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'config' | 'creating' | 'registering' | 'complete'>('config');
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    name: '',
    symbol: '',
    decimals: 9,
    initialSupply: 1000000
  });
  const [mintAddress, setMintAddress] = useState<string>('');
  const [oftAddress, setOftAddress] = useState<string>('');
  const [targetChains, setTargetChains] = useState<string[]>(['ethereum', 'polygon']);

  const handleGenerateRandom = () => {
    const randomConfig = generateRandomTokenConfig();
    setTokenConfig(randomConfig);
  };

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create tokens",
        variant: "destructive"
      });
      return;
    }

    setStep('creating');
    
    try {
      // Only real wallets are supported now

      // Real wallet flow - ensure wallet is properly connected
      if (!publicKey || !signTransaction || !signAllTransactions) {
        throw new Error("Wallet not properly connected. Please reconnect your wallet.");
      }

      toast({
        title: "Requesting SOL airdrop",
        description: "Getting devnet SOL for transaction fees..."
      });
      
      try {
        await requestAirdrop(connection, publicKey, 2);
        toast({
          title: "SOL Airdrop Received",
          description: "Received 2 SOL for transaction fees"
        });
      } catch (error) {
        console.log("Airdrop error (continuing anyway):", error);
        toast({
          title: "Airdrop Note", 
          description: "Using existing SOL balance for transactions",
        });
      }

      // Create SPL token with proper wallet adapter
      const walletAdapter = {
        publicKey,
        signTransaction: async (tx: any) => {
          console.log("Wallet adapter signing transaction...");
          return await signTransaction(tx);
        },
        signAllTransactions: async (txs: any[]) => {
          console.log("Wallet adapter signing multiple transactions...");
          return await signAllTransactions(txs);
        }
      };

      toast({
        title: "Creating SPL Token",
        description: "Building and signing transaction..."
      });

      const newMintAddress = await createSPLToken(connection, walletAdapter, tokenConfig);
      setMintAddress(newMintAddress);

      // Save token to database
      await createToken({
        mintAddress: newMintAddress,
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        decimals: tokenConfig.decimals,
        balance: tokenConfig.initialSupply.toString(),
        isOftEnabled: false,
        layerzeroId: null,
        supportedChains: null,
        totalTransfers: 0
      });

      toast({
        title: "SPL Token Created",
        description: `Successfully created ${tokenConfig.symbol} token`,
      });

      setStep('registering');
      
      // Register as OFT with LayerZero
      const oftResult = await registerOFT(newMintAddress, targetChains, publicKey.toString());
      setOftAddress(oftResult.oftAddress);

      // Update token with OFT info
      await createToken({
        mintAddress: newMintAddress,
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        decimals: tokenConfig.decimals,
        balance: tokenConfig.initialSupply.toString(),
        isOftEnabled: true,
        layerzeroId: oftResult.oftAddress,
        supportedChains: targetChains,
        totalTransfers: 0
      });

      toast({
        title: "OFT Registration Complete",
        description: `Token registered as OFT on LayerZero`,
      });

      setStep('complete');
    } catch (error: any) {
      console.error('Token creation error:', error);
      toast({
        title: "Creation Failed",
        description: `Failed to create token: ${error.message || error.toString()}`,
        variant: "destructive"
      });
      setStep('config');
    }
  };

  const handleClose = () => {
    setStep('config');
    setTokenConfig({ name: '', symbol: '', decimals: 9, initialSupply: 1000000 });
    setMintAddress('');
    setOftAddress('');
    onClose();
  };

  const supportedChains = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'avalanche', name: 'Avalanche', icon: '🔺' },
    { id: 'bsc', name: 'BNB Chain', icon: '💛' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create & Register OFT Token</DialogTitle>
        </DialogHeader>
        
        {step === 'config' && (
          <div className="space-y-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Why Register as OFT Token?</p>
                  <div className="text-blue-700 mt-1 space-y-1">
                    <p><strong>✓ Cross-Chain Inheritance:</strong> Beneficiaries can claim on Ethereum, Polygon, Avalanche, or BSC</p>
                    <p><strong>✓ No Complex Setup:</strong> Recipients don't need Solana wallets or SOL for gas</p>
                    <p><strong>✓ LayerZero Magic:</strong> Automatic bridging handles all cross-chain complexity</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={tokenConfig.name}
                  onChange={(e) => setTokenConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Token"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={tokenConfig.symbol}
                  onChange={(e) => setTokenConfig(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  placeholder="MTK"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  value={tokenConfig.decimals}
                  onChange={(e) => setTokenConfig(prev => ({ ...prev, decimals: parseInt(e.target.value) || 9 }))}
                  min="0"
                  max="18"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="supply">Initial Supply</Label>
                <Input
                  id="supply"
                  type="number"
                  value={tokenConfig.initialSupply}
                  onChange={(e) => setTokenConfig(prev => ({ ...prev, initialSupply: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Target Chains for OFT</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {supportedChains.map((chain) => (
                  <div
                    key={chain.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      targetChains.includes(chain.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (targetChains.includes(chain.id)) {
                        setTargetChains(prev => prev.filter(c => c !== chain.id));
                      } else {
                        setTargetChains(prev => [...prev, chain.id]);
                      }
                    }}
                  >
                    <span className="text-lg">{chain.icon}</span>
                    <span className="font-medium">{chain.name}</span>
                    {targetChains.includes(chain.id) && (
                      <i className="fas fa-check text-primary ml-auto"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleGenerateRandom}
                variant="outline"
                className="flex-1"
              >
                <i className="fas fa-dice mr-2"></i>
                Generate Random
              </Button>
              <Button
                onClick={handleCreateToken}
                disabled={!tokenConfig.name || !tokenConfig.symbol || targetChains.length === 0}
                className="flex-1 gradient-primary text-white hover:opacity-90"
              >
                <i className="fas fa-rocket mr-2"></i>
                Create OFT Token
              </Button>
            </div>
          </div>
        )}

        {step === 'creating' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold">Creating SPL Token</h3>
              <p className="text-gray-600">Creating your token on Solana devnet...</p>
            </div>
          </div>
        )}

        {step === 'registering' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold">Registering OFT</h3>
              <p className="text-gray-600">Registering token with LayerZero protocol...</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-check text-2xl text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-emerald-800">OFT Token Created!</h3>
              <p className="text-gray-600">Your token is now ready for cross-chain transfers</p>
            </div>
            
            <Card className="p-4 text-left">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Token:</span>
                  <span>{tokenConfig.name} ({tokenConfig.symbol})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mint Address:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {mintAddress.slice(0, 8)}...{mintAddress.slice(-8)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">OFT Address:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {oftAddress}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Supported Chains:</span>
                  <div className="flex space-x-1">
                    {targetChains.map(chain => (
                      <Badge key={chain} variant="secondary" className="text-xs">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Button onClick={handleClose} className="w-full gradient-primary text-white hover:opacity-90">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}