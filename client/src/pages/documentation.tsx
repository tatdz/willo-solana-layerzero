import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

export default function Documentation() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setLocation('/')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Willo
              </Button>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              Documentation
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <div className="text-sm font-medium text-gray-900 mb-4">Documentation</div>
              <nav className="space-y-2">
                <a href="#overview" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Overview
                </a>
                <a href="#why-oft" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Why OFT
                </a>
                <a href="#setup" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Setup Guide
                </a>
                <a href="#api" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  API Reference
                </a>
                <a href="#smart-contracts" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Smart Contracts
                </a>
                <a href="#troubleshooting" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Troubleshooting
                </a>
                <a href="#roadmap" className="block text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md">
                  Product Roadmap
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Platform Overview */}
            <section id="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-shield-alt mr-3 text-primary"></i>
                    Willo Platform Overview
                  </CardTitle>
                  <CardDescription>
                    The world's first omnichain inheritance platform built on Solana with LayerZero V2 OApp/OFT standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">The Digital Asset Inheritance Crisis</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-orange-500 font-bold mr-2">•</span>
                        <strong>140+ Billion Lost</strong>: Millions of dollars in crypto assets are lost annually due to lack of inheritance planning
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 font-bold mr-2">•</span>
                        <strong>Multi-Chain Complexity</strong>: Digital assets are scattered across 20+ different blockchains
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 font-bold mr-2">•</span>
                        <strong>Technical Barriers</strong>: Traditional inheritance methods don't work with decentralized, permissionless assets
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 font-bold mr-2">•</span>
                        <strong>Time-Critical Claims</strong>: Beneficiaries struggle with complex claim processes across different networks
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Willo's Revolutionary Solution</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 font-bold mr-2">•</span>
                        <strong>Omnichain Unity</strong>: Convert SPL tokens to LayerZero V2 OFTs, enabling seamless inheritance across Ethereum, Polygon, Avalanche, and BSC
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 font-bold mr-2">•</span>
                        <strong>Smart Contract Automation</strong>: Solana-based smart contracts automatically trigger inheritance based on configurable inactivity periods
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 font-bold mr-2">•</span>
                        <strong>One Platform, All Chains</strong>: Beneficiaries can claim assets on any supported blockchain, eliminating technical complexity
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 font-bold mr-2">•</span>
                        <strong>Real-Time Asset Discovery</strong>: API integration provides live portfolio tracking and USD valuations across all networks
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Why OFT Tokens */}
            <section id="why-oft">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-coins mr-3 text-primary"></i>
                    Why LayerZero V2 OFT Tokens Are Essential
                  </CardTitle>
                  <CardDescription>
                    Understanding the critical role of Omnichain Fungible Tokens in digital inheritance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">The Inheritance Challenge</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                      <p className="text-red-800"><strong>Fragmented Assets:</strong> Your digital wealth spans Ethereum (DeFi), Polygon (gaming), Avalanche (enterprise), BSC (trading)</p>
                      <p className="text-red-800"><strong>Technical Complexity:</strong> Beneficiaries need separate wallets, gas tokens, and technical knowledge for each blockchain</p>
                      <p className="text-red-800"><strong>Time-Critical Claims:</strong> Inheritance claims must be processed quickly across multiple networks simultaneously</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">LayerZero V2 OFT Solution</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                      <p className="text-green-800"><strong>Universal Token Standard:</strong> Convert SPL tokens to OFTs that exist natively on all supported chains</p>
                      <p className="text-green-800"><strong>Single-Click Claims:</strong> Beneficiaries claim on their preferred network, automatically triggering cross-chain transfers</p>
                      <p className="text-green-800"><strong>Gas Abstraction:</strong> LayerZero handles complex cross-chain messaging and token bridging automatically</p>
                      <p className="text-green-800"><strong>Atomic Execution:</strong> Inheritance claims either succeed completely across all chains or fail safely</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Solana + LayerZero = Optimal Architecture</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <i className="fas fa-bolt mr-2 mt-1 text-purple-500"></i>
                        <strong>Solana Smart Contracts:</strong> High-performance, low-cost inheritance logic and inactivity detection
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-bridge mr-2 mt-1 text-purple-500"></i>
                        <strong>LayerZero Bridging:</strong> Seamless asset movement across 20+ blockchain networks
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-globe mr-2 mt-1 text-purple-500"></i>
                        <strong>Unified Experience:</strong> One platform manages assets across entire multi-chain ecosystem
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Setup Guide */}
            <section id="setup">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-rocket mr-3 text-primary"></i>
                    Complete Setup Guide
                  </CardTitle>
                  <CardDescription>
                    Step-by-step instructions to get started with Willo inheritance platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="prerequisites" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                      <TabsTrigger value="oft-setup">OFT Setup</TabsTrigger>
                      <TabsTrigger value="vault-creation">Vault Creation</TabsTrigger>
                      <TabsTrigger value="beneficiary">Beneficiary Setup</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="prerequisites" className="space-y-4">
                      <h3 className="text-lg font-semibold">Prerequisites</h3>
                      <ol className="list-decimal list-inside space-y-3 text-gray-600">
                        <li><strong>Solana Wallet:</strong> Install Solflare or Phantom wallet extension</li>
                        <li><strong>Testnet SOL:</strong> Get free testnet SOL from Solana faucet</li>
                        <li><strong>Solana CLI:</strong> Install Solana CLI tools for token creation</li>
                        <li><strong>LayerZero Account:</strong> Create account on LayerZero testnet</li>
                      </ol>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800"><strong>Note:</strong> All setup steps use testnet environments. No real funds are required.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="oft-setup" className="space-y-4">
                      <h3 className="text-lg font-semibold">OFT Token Registration</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Step 1: Create SPL Token</h4>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`# Create new token
spl-token create-token --decimals 9

# Create token account
spl-token create-account <TOKEN_MINT>

# Mint initial supply
spl-token mint <TOKEN_MINT> 1000000`}
                          </pre>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Step 2: Register as OFT in Willo</h4>
                          <p className="text-gray-600 mb-2">Use the OFT Token Registration form in the platform to:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Enter your token mint address</li>
                            <li>Set token name and symbol</li>
                            <li>Configure initial supply and decimals</li>
                            <li>Submit for LayerZero OFT registration</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800"><strong>Why This Matters:</strong> OFT registration enables your token to move seamlessly across Ethereum, Polygon, Avalanche, and BSC. Without this, inheritance claims would be limited to Solana only.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="vault-creation" className="space-y-4">
                      <h3 className="text-lg font-semibold">Creating Inheritance Vaults</h3>
                      <div className="space-y-4">
                        <p className="text-gray-600">Inheritance vaults automatically distribute your OFT tokens to beneficiaries when you become inactive.</p>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Vault Configuration</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Vault Name:</strong> Descriptive name for your inheritance vault</li>
                            <li><strong>Inactivity Period:</strong> How long without activity before inheritance triggers (30-365 days)</li>
                            <li><strong>Beneficiaries:</strong> Add wallet addresses of your beneficiaries</li>
                            <li><strong>Asset Allocation:</strong> Distribute your OFT tokens with percentage allocations</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800"><strong>OFT Advantage:</strong> Because your tokens are registered as OFTs, beneficiaries can claim their inheritance on any supported blockchain - Ethereum, Polygon, Avalanche, or BSC - regardless of where you originally held the assets.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="beneficiary" className="space-y-4">
                      <h3 className="text-lg font-semibold">Beneficiary Experience</h3>
                      <div className="space-y-4">
                        <p className="text-gray-600">Beneficiaries have a streamlined experience thanks to OFT cross-chain capabilities.</p>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Claim Process</h4>
                          <ol className="list-decimal list-inside space-y-2 text-gray-600">
                            <li>Receive notification when vault becomes claimable</li>
                            <li>Connect wallet on preferred blockchain (Ethereum, Polygon, etc.)</li>
                            <li>Click "Claim Inheritance" - LayerZero handles cross-chain execution</li>
                            <li>Receive tokens directly in chosen wallet</li>
                          </ol>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800"><strong>Cross-Chain Benefits:</strong> Beneficiaries don't need Solana wallets or SOL for gas. They can claim on Ethereum with ETH, Polygon with MATIC, etc. The OFT standard makes this seamless.</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* API Reference */}
            <section id="api">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-code mr-3 text-primary"></i>
                    API Reference
                  </CardTitle>
                  <CardDescription>
                    REST API endpoints for integrating with Willo platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <p className="text-gray-600 mb-2">Wallet-based authentication using connected Solana wallet</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">
{`Authorization: Wallet <wallet_address>`}
                    </pre>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">OFT Token Endpoints</h4>
                    <div className="space-y-2">
                      <div>
                        <code className="bg-blue-100 px-2 py-1 rounded text-sm">GET /api/oft-tokens</code>
                        <p className="text-gray-600 text-sm">List all registered OFT tokens for user</p>
                      </div>
                      <div>
                        <code className="bg-green-100 px-2 py-1 rounded text-sm">POST /api/oft-tokens</code>
                        <p className="text-gray-600 text-sm">Register new SPL token as OFT</p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Vault Endpoints</h4>
                    <div className="space-y-2">
                      <div>
                        <code className="bg-blue-100 px-2 py-1 rounded text-sm">GET /api/vaults</code>
                        <p className="text-gray-600 text-sm">List all inheritance vaults for user</p>
                      </div>
                      <div>
                        <code className="bg-green-100 px-2 py-1 rounded text-sm">POST /api/vaults</code>
                        <p className="text-gray-600 text-sm">Create new inheritance vault</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Smart Contracts */}
            <section id="smart-contracts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-file-contract mr-3 text-primary"></i>
                    Smart Contract Integration
                  </CardTitle>
                  <CardDescription>
                    Deployed Solana smart contracts powering inheritance automation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Willo Program</h4>
                    <p className="text-gray-600 mb-2">Main inheritance contract deployed on Solana testnet</p>
                    <div className="bg-gray-100 p-3 rounded">
                      <code className="text-sm">BF5vS2PcjByaowXxPTKbkyEcm8kVBtRemzmJrc5wWkuw</code>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Key Functions</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><strong>createVault:</strong> Initialize new inheritance vault with OFT assets</li>
                      <li><strong>updateActivity:</strong> Reset inactivity timer when user is active</li>
                      <li><strong>claimInheritance:</strong> Process beneficiary claims after inactivity period</li>
                      <li><strong>crossChainClaim:</strong> Trigger LayerZero OFT transfers to beneficiary's preferred chain</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800"><strong>OFT Integration:</strong> The smart contract works with LayerZero OFT adapters to enable cross-chain inheritance claims. When a beneficiary claims on Ethereum, the contract automatically bridges tokens from Solana via LayerZero protocol.</p>
                  </div>

                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium mb-2 text-yellow-800">Deployment Verification</h4>
                    <p className="text-yellow-700 mb-3">To verify live deployment, real LayerZero transactions will be generated when:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 mb-3">
                      <li>Users register actual OFT tokens</li>
                      <li>Cross-chain transfers are initiated</li>
                      <li>Inheritance claims are processed</li>
                    </ul>
                    <div className="text-sm text-yellow-600">
                      <strong>Current Status:</strong> Development Environment | <strong>Network:</strong> Solana Devnet | <strong>LayerZero:</strong> Testnet Ready
                    </div>
                    <Button 
                      onClick={() => window.open('https://explorer.solana.com/address/BF5vS2PcjByaowXxPTKbkyEcm8kVBtRemzmJrc5wWkuw?cluster=devnet', '_blank')}
                      className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      View Solana Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-tools mr-3 text-primary"></i>
                    Troubleshooting
                  </CardTitle>
                  <CardDescription>
                    Common issues and solutions for Willo platform usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Wallet Connection Issues</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Solflare not detected:</strong> Install browser extension from solflare.com or use mobile app with QR scanning</p>
                      <p><strong>Connection failed:</strong> Unlock wallet, refresh page, approve connection request</p>
                      <p><strong>Phantom issues:</strong> Ensure latest extension version, clear browser cache</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">OFT Token Creation Problems</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Insufficient SOL:</strong> Request devnet airdrop or fund wallet with SOL</p>
                      <p><strong>Transaction timeout:</strong> Check network congestion, retry after few minutes</p>
                      <p><strong>Token creation failed:</strong> Verify wallet connection and sufficient balance</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Cross-Chain Transfer Issues</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>LayerZero fees high:</strong> Use testnet for development, mainnet for production</p>
                      <p><strong>Transfer stuck:</strong> Check LayerZeroScan for transaction status</p>
                      <p><strong>Destination not received:</strong> Allow 10-30 minutes for cross-chain finality</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800"><strong>Need Help?</strong> Join our Discord community or submit GitHub issues for technical support.</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Product Roadmap */}
            <section id="roadmap">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-map mr-3 text-primary"></i>
                    Product Roadmap
                  </CardTitle>
                  <CardDescription>
                    Upcoming features and platform development timeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium mb-2 text-green-800">Q1 2025 - Completed ✓</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Solana smart contract deployment</li>
                      <li>• LayerZero V2 OFT integration</li>
                      <li>• Multi-wallet support (Solflare, Phantom)</li>
                      <li>• Cross-chain inheritance vaults</li>
                      <li>• Real-time asset discovery</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium mb-2 text-blue-800">Q2 2025 - In Development</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Enhanced mobile wallet support</li>
                      <li>• Advanced beneficiary management</li>
                      <li>• Automated inheritance triggers</li>
                      <li>• Gas optimization features</li>
                      <li>• Multi-signature vault support</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Q3 2025 - Planned</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Additional blockchain support (Arbitrum, Base)</li>
                      <li>• NFT inheritance capabilities</li>
                      <li>• Legal document integration</li>
                      <li>• Insurance partnerships</li>
                      <li>• Enterprise vault management</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Q4 2025 - Vision</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• AI-powered inheritance planning</li>
                      <li>• Regulatory compliance tools</li>
                      <li>• Global custody partnerships</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• White-label solutions</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800"><strong>Community Driven:</strong> Feature priorities are influenced by user feedback and community voting. Join our governance process!</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}