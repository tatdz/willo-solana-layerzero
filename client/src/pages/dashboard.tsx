import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DashboardStats } from "@/components/dashboard-stats";
import { VaultManagement } from "@/components/vault-management";
import { OftTokenList } from "@/components/oft-token-list";
import { CrossChainTransfer } from "@/components/cross-chain-transfer";
import { OftSetupGuide } from "@/components/oft-setup-guide";
import { VaultCreation } from "@/components/vault-creation";
import { EnhancedVaultCreation } from "@/components/enhanced-vault-creation";
import { OftTokenRegistration } from "@/components/oft-token-registration";
import { WalletConnection } from "@/components/wallet-connection";
import { BeneficiaryPortal } from "@/components/beneficiary-portal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/components/wallet-provider";
import { getWalletAssets, getDemoAssets, formatUsdValue, type WalletAssets } from "@/lib/asset-discovery";
import { getUserVaults, getSolanaExplorerUrl, WILLO_PROGRAM_ID } from "@/lib/solana-program";
import { Wallet, Plus, ExternalLink, RefreshCw, TrendingUp, Shield, Coins, ArrowRightLeft, Gift } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showVaultCreation, setShowVaultCreation] = useState(false);
  const [showEnhancedVaultCreation, setShowEnhancedVaultCreation] = useState(false);
  const [showTokenRegistration, setShowTokenRegistration] = useState(false);

  // Check URL parameters for initial tab and actions
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const action = urlParams.get('action');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (action === 'create' && tab === 'vaults') {
      setShowEnhancedVaultCreation(true);
    }
  }, []);
  const [walletAssets, setWalletAssets] = useState<WalletAssets | null>(null);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [onChainVaults, setOnChainVaults] = useState(0);
  
  const { connected, walletAddress, walletType, connection } = useWallet();

  // Load wallet assets and on-chain data
  useEffect(() => {
    if (connected && walletAddress) {
      loadDashboardData();
    }
  }, [connected, walletAddress]);

  const loadDashboardData = async () => {
    if (!walletAddress) return;
    
    setAssetsLoading(true);
    try {
      // Load wallet assets for real wallets only
      const assets = await getWalletAssets(walletAddress);
      setWalletAssets(assets);

      // Load on-chain vault count
      const vaults = await getUserVaults(
        connection, 
        new (await import('@solana/web3.js')).PublicKey(walletAddress)
      );
      setOnChainVaults(vaults.length);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setAssetsLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Value Proposition Section */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  Secure Your Digital Legacy with <span className="text-blue-600">Willo</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The first omnichain inheritance platform built on Solana with LayerZero V2 OApp/OFT standards. 
                  Protect and transfer your digital assets across multiple blockchains with smart contract security.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Willo?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <Shield className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Cross-Chain Asset Protection</h3>
                      <p className="text-gray-600">Your digital assets span multiple blockchains. Willo's OFT tokens enable seamless inheritance across Ethereum, Polygon, Avalanche, and BSC through LayerZero protocol.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Coins className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Contract Security</h3>
                      <p className="text-gray-600">Built on Solana's high-performance blockchain with deployed smart contracts that automatically execute inheritance rules based on configurable inactivity periods.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <ArrowRightLeft className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Omnichain Fungible Tokens (OFT)</h3>
                      <p className="text-gray-600">Convert your SPL tokens to OFTs for true cross-chain functionality. Beneficiaries can claim assets on any supported network, eliminating blockchain barriers in inheritance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WalletConnection />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Willo Dashboard</h1>
              <p className="text-gray-600">Manage your omnichain inheritance platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Live on Solana</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={assetsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${assetsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Smart Contract Info */}
        <Alert className="mb-6">
          <Shield className="w-4 h-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Connected to Solana Program: <code className="text-xs">{WILLO_PROGRAM_ID.toString()}</code>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://explorer.solana.com/address/${WILLO_PROGRAM_ID.toString()}?cluster=devnet`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>

        {/* Enhanced Overview Cards */}
        {activeTab === "overview" && walletAssets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatUsdValue(walletAssets.totalUsdValue)}</div>
                <p className="text-xs text-muted-foreground">
                  {walletAssets.assets.length} assets across {new Set(walletAssets.assets.map(a => a.chain)).size} chains
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vaults</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{onChainVaults}</div>
                <p className="text-xs text-muted-foreground">
                  On-chain inheritance vaults
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OFT Tokens</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {walletAssets.assets.filter(a => a.type === 'spl').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  SPL tokens ready for OFT registration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cross-Chain Ready</CardTitle>
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(walletAssets.assets.map(a => a.chain)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported blockchain networks
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Portfolio Overview" },
              { id: "vaults", label: "Inheritance Vaults" },
              { id: "tokens", label: "OFT Token Portfolio" },
              { id: "transfers", label: "Cross-Chain Transfers" },
              { id: "beneficiary", label: "Beneficiary Portal" },
              { id: "guide", label: "Setup Guide" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowEnhancedVaultCreation(true)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Inheritance Vault</span>
                </CardTitle>
                <CardDescription>
                  Set up a new inheritance vault with multi-chain assets and smart beneficiary allocation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowTokenRegistration(true)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Register OFT Token</span>
                </CardTitle>
                <CardDescription>
                  Create and register SPL tokens as Omnichain Fungible Tokens for cross-chain functionality
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("transfers")}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  <span>Cross-Chain Transfer</span>
                </CardTitle>
                <CardDescription>
                  Transfer OFT tokens across multiple blockchain networks using LayerZero protocol
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "overview" && <DashboardStats />}
        {activeTab === "vaults" && <VaultManagement />}
        {activeTab === "tokens" && <OftTokenList />}
        {activeTab === "transfers" && <CrossChainTransfer />}
        {activeTab === "beneficiary" && <BeneficiaryPortal />}
        {activeTab === "guide" && <OftSetupGuide />}

        {/* Modals */}
        <VaultCreation 
          isOpen={showVaultCreation} 
          onClose={() => setShowVaultCreation(false)} 
        />
        <EnhancedVaultCreation 
          isOpen={showEnhancedVaultCreation} 
          onClose={() => setShowEnhancedVaultCreation(false)}
          onSuccess={(vaultId) => {
            console.log('Vault created:', vaultId);
            refreshData();
          }}
        />
        <OftTokenRegistration 
          isOpen={showTokenRegistration} 
          onClose={() => setShowTokenRegistration(false)} 
        />
      </main>
      <Footer />
    </div>
  );
}
