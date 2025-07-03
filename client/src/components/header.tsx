import { useWallet } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import { WalletSelection } from "@/components/wallet-selection";
import { useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { connected, connecting, disconnect, walletAddress, walletType } = useWallet();
  const [showWalletSelection, setShowWalletSelection] = useState(false);
  const [location, setLocation] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-coins text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Willo</h1>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                OFT
              </span>
            </div>

          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setLocation('/documentation')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <i className="fas fa-book mr-2"></i>
              Documentation
            </Button>
            {location === '/dashboard' && (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Solana Testnet</span>
                </div>
                <Button
                  onClick={connected ? disconnect : () => setShowWalletSelection(true)}
                  disabled={connecting}
                  className="gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  <i className="fas fa-wallet mr-2"></i>
                  {connecting 
                    ? "Connecting..." 
                    : connected && walletType
                      ? `${walletType.charAt(0).toUpperCase()}${walletType.slice(1)} Connected`
                      : connected 
                        ? "Connected"
                        : "Connect Wallet"
                  }
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <WalletSelection 
        isOpen={showWalletSelection} 
        onClose={() => setShowWalletSelection(false)} 
      />
    </header>
  );
}
