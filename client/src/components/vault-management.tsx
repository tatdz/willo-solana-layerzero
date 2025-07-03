import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet-provider";
import { VaultCreation } from "@/components/vault-creation";
import { useState } from "react";

export function VaultManagement() {
  const { walletAddress } = useWallet();
  const [showVaultCreation, setShowVaultCreation] = useState(false);

  const { data: user } = useQuery({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress,
  });

  const { data: vaults = [], isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/vaults`],
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700";
      case "pending":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Inheritance Vaults</h2>
        <Button 
          onClick={() => setShowVaultCreation(true)}
          className="gradient-emerald text-white hover:opacity-90"
        >
          <i className="fas fa-plus mr-2"></i>Create Vault
        </Button>
      </div>

      {vaults.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-vault text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vaults Created</h3>
          <p className="text-gray-500 mb-6">Create your first inheritance vault to secure your OFT tokens.</p>
          <Button 
            onClick={() => setShowVaultCreation(true)}
            className="gradient-emerald text-white hover:opacity-90"
          >
            <i className="fas fa-plus mr-2"></i>Create Your First Vault
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {vaults.map((vault: any) => (
            <div key={vault.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vault.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(vault.createdAt).toLocaleDateString()} • {vault.status}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(vault.status)}>
                    {vault.status.charAt(0).toUpperCase() + vault.status.slice(1)}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-ellipsis-h"></i>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Value</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${parseFloat(vault.totalValue || "0").toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">OFT Assets</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {vault.assets?.length || 0} tokens
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Beneficiaries</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {vault.beneficiaries?.length || 0} people
                  </p>
                </div>
              </div>

              {vault.assets && vault.assets.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {vault.assets.map((asset: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            {asset.token?.symbol?.charAt(0) || "T"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{asset.token?.name || "Unknown Token"}</p>
                          <p className="text-sm text-gray-500">
                            {parseFloat(asset.amount).toLocaleString()} {asset.token?.symbol}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(parseFloat(asset.amount) * 1.47).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : vault.status === "pending" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-exclamation-triangle text-amber-600 mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Vault Setup Incomplete</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Add OFT assets and configure beneficiaries to activate this vault.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex space-x-3">
                {vault.status === "pending" ? (
                  <Button className="flex-1 gradient-amber text-white hover:opacity-90">
                    Complete Setup
                  </Button>
                ) : (
                  <>
                    <Button className="flex-1 gradient-primary text-white hover:opacity-90">
                      Manage Assets
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-gray-400">
                      Edit Beneficiaries
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <VaultCreation 
        isOpen={showVaultCreation} 
        onClose={() => setShowVaultCreation(false)} 
      />
    </Card>
  );
}
