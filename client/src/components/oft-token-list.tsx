import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet-provider";
import { Badge } from "@/components/ui/badge";
import { OftTokenRegistration } from "@/components/oft-token-registration";
import { useState } from "react";

export function OftTokenList() {
  const { walletAddress } = useWallet();
  const [showRegistration, setShowRegistration] = useState(false);

  const { data: user } = useQuery({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress,
  });

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/oft-tokens`],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">OFT Token Portfolio</h2>
        <Button 
          onClick={() => setShowRegistration(true)}
          className="gradient-primary text-white hover:opacity-90"
        >
          <i className="fas fa-plus mr-2"></i>Register New OFT
        </Button>
      </div>

      {tokens.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-coins text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No OFT Tokens</h3>
          <p className="text-gray-500 mb-6">Register your first SPL token as an OFT to get started.</p>
          <Button 
            onClick={() => setShowRegistration(true)}
            className="gradient-primary text-white hover:opacity-90"
          >
            <i className="fas fa-plus mr-2"></i>Register Your First OFT
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tokens.map((token: any) => (
            <div
              key={token.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{token.name}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">{token.symbol}</p>
                      {token.isOftEnabled && (
                        <Badge variant="secondary" className="text-xs">OFT Enabled</Badge>
                      )}
                    </div>
                    <code className="text-xs text-gray-400 font-mono">
                      {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-4)}
                    </code>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    ≈ ${(parseFloat(token.balance) * 1.47).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>Chains: {token.supportedChains?.length || 1}</span>
                  <span>•</span>
                  <span>Transfers: {token.totalTransfers}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Transfer
                  </Button>
                  <Button size="sm" className="gradient-primary text-white hover:opacity-90">
                    Add to Vault
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <OftTokenRegistration 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />
    </Card>
  );
}
