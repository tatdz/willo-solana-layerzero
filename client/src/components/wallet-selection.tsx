import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet, WalletType } from "./wallet-provider";
import { useState } from "react";

interface WalletSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSelection({ isOpen, onClose }: WalletSelectionProps) {
  const { connect, connecting } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  const walletOptions = [
    {
      type: "solflare" as WalletType,
      name: "Solflare",
      description: "Popular Solana wallet with mobile support",
      icon: "🌅",
      available: typeof window !== 'undefined' && (window as any).solflare,
      installUrl: "https://solflare.com/",
    },
    {
      type: "phantom" as WalletType,
      name: "Phantom",
      description: "Leading Solana wallet with browser extension",
      icon: "👻",
      available: typeof window !== 'undefined' && (window as any).phantom?.solana,
      installUrl: "https://phantom.app/",
    },
  ];

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    try {
      await connect(walletType);
      onClose();
    } catch (error) {
      console.error(`Failed to connect ${walletType}:`, error);
      setSelectedWallet(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose a wallet to connect to Willo and start managing your OFT tokens
          </p>
          
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <Card 
                key={wallet.type}
                className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  selectedWallet === wallet.type ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{wallet.name}</h3>
                        {wallet.available ? (
                          <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700">
                            Install Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{wallet.description}</p>
                    </div>
                  </div>
                  
                  {wallet.available ? (
                    <Button
                      onClick={() => handleConnect(wallet.type)}
                      disabled={connecting}
                      size="sm"
                      className="gradient-primary text-white hover:opacity-90"
                    >
                      {connecting && selectedWallet === wallet.type ? "Connecting..." : "Connect"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => wallet.installUrl && window.open(wallet.installUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      Install
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-blue-800">Secure Connection</p>
                <p className="text-blue-700 mt-1">
                  Your wallet credentials are never stored. We only request access to view your public key and sign transactions when authorized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}