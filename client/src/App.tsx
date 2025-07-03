import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/wallet-provider";
import Dashboard from "@/pages/dashboard";
import Documentation from "@/pages/documentation";
import NotFound from "@/pages/not-found";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WalletConnection } from "@/components/wallet-connection";
import { useWallet } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { WalletSelection } from "@/components/wallet-selection";
import { useLocation } from "wouter";

// Landing Page Component
function LandingPage() {
  const { connected } = useWallet();
  const [, setLocation] = useLocation();
  const [showWalletSelection, setShowWalletSelection] = useState(false);

  const handleCreateVault = () => {
    if (connected) {
      setLocation('/dashboard?tab=vaults&action=create');
    } else {
      setShowWalletSelection(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              World's First Omnichain Inheritance Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure Your Digital Legacy
              <span className="block text-primary">Across Major Blockchains</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Built on Solana with LayerZero V2 OApp/OFT standards. Automatically distribute your crypto assets 
              to beneficiaries across Ethereum, Polygon, Avalanche, and BSC with smart contract automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={handleCreateVault}
                className="gradient-primary text-white px-8 py-4 text-lg rounded-xl hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-shield-alt mr-3"></i>
                Create Digital Inheritance Vault
              </Button>
              <Button 
                onClick={() => setLocation('/documentation')}
                variant="outline" 
                className="px-8 py-4 text-lg rounded-xl border-gray-300"
              >
                <i className="fas fa-book mr-3"></i>
                Learn More
              </Button>
            </div>

            {/* Crisis Statistics */}
            <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">$140B+</div>
                <div className="text-red-800">Lost annually due to lack of crypto inheritance planning</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-orange-600 mb-2">Too many blockchains</div>
                <div className="text-orange-800">scatter your digital wealth</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="text-2xl font-bold text-yellow-600 mb-2">Complex processes</div>
                <div className="text-yellow-800">in claiming assets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why LayerZero V2 OFT Tokens Are Essential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert your SPL tokens to Omnichain Fungible Tokens (OFTs) for seamless inheritance across all major blockchains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-link text-green-600 text-xl"></i>
                </div>
                <CardTitle className="text-lg">Omnichain Unity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  One token standard works across Ethereum, Polygon, Avalanche, and BSC automatically
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mouse-pointer text-blue-600 text-xl"></i>
                </div>
                <CardTitle className="text-lg">Single-Click Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Beneficiaries claim on any blockchain - LayerZero handles cross-chain execution
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-robot text-purple-600 text-xl"></i>
                </div>
                <CardTitle className="text-lg">Smart Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Solana smart contracts automatically detect inactivity and trigger inheritance
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-indigo-600 text-xl"></i>
                </div>
                <CardTitle className="text-lg">Atomic Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Inheritance claims succeed completely across all chains or fail safely
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Willo Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to secure your digital legacy across all blockchains
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Register OFT Tokens</h3>
              <p className="text-gray-600">
                Convert your SPL tokens to LayerZero V2 OFTs, enabling cross-chain inheritance capabilities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Inheritance Vault</h3>
              <p className="text-gray-600">
                Set up automated inheritance with beneficiaries, allocations, and inactivity periods
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Beneficiaries Claim</h3>
              <p className="text-gray-600">
                Beneficiaries can claim on any supported blockchain using LayerZero's omnichain infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <WalletSelection 
        isOpen={showWalletSelection} 
        onClose={() => setShowWalletSelection(false)} 
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/documentation" component={Documentation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <div className="app">
            <Toaster />
            <Router />
          </div>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
