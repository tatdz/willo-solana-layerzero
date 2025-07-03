# Willo - Comprehensive Omnichain Inheritance Platform

**The world's first omnichain inheritance platform built on Solana with LayerZero V2 OApp/OFT standards. Secure your digital legacy across multiple blockchains with smart contract automation and cross-chain asset management.**

## 💡 Why Willo Solves Critical Inheritance Problems

### **The Digital Asset Inheritance Crisis**
- **140+ Billion Lost**: Millions of dollars in crypto assets are lost annually due to lack of inheritance planning
- **Too Many Blockchains**: Digital assets are scattered across major blockchains making management complex
- **Technical Barriers**: Traditional inheritance methods don't work with decentralized, permissionless assets
- **Complex Processes**: Beneficiaries struggle with complex processes in claiming assets across different networks

### **Willo's Revolutionary Solution**
- **Omnichain Unity**: Convert your SPL tokens to LayerZero V2 OFTs, enabling seamless inheritance across major blockchains
- **Smart Contract Automation**: Solana-based smart contracts automatically trigger inheritance based on configurable inactivity periods
- **One Platform, All Chains**: Beneficiaries can claim assets on any supported blockchain, eliminating technical complexity
- **Real-Time Asset Discovery**: API integration provides live portfolio tracking and USD valuations across all networks

![Willo Platform](https://img.shields.io/badge/Platform-Solana%20%2B%20LayerZero-blue)
![Smart Contract](https://img.shields.io/badge/Smart%20Contract-Deployed-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)

## 🌟 Comprehensive Features

### **🔗 Real Blockchain Integration**
- **Deployed Solana Program**: Live smart contract on devnet (Program ID: `BF5vS2PcjByaowXxPTKbkyEcm8kVBtRemzmJrc5wWkuw`)
- **API-Based Asset Discovery**: Real-time wallet balance fetching using Helius API and Solana RPC
- **On-Chain Vault Storage**: All vault data stored on Solana blockchain with verifiable transactions
- **Transaction Verification**: Every action generates verifiable blockchain transactions

### **💰 Multi-Wallet & Asset Management**
- **Multi-Wallet Support**: Solflare and Phantom wallet integration
- **Real Asset Discovery**: Automatic detection of SOL, SPL tokens, and cross-chain assets
- **Portfolio Analytics**: Live USD valuations and cross-chain asset aggregation
- **Asset Flexibility**: Include any amount up to available balance in inheritance vaults

### **🏦 Advanced Inheritance System**
- **Smart Vault Creation**: Multi-step wizard with real asset selection
- **Flexible Beneficiary Allocation**: Per-asset percentage distribution to multiple beneficiaries
- **Inactivity Detection**: Configurable periods with automatic vault triggering
- **Claim Processing**: Secure inheritance claims via deployed Solana program

### **🌐 Cross-Chain Capabilities**
- **OFT Token Registration**: Convert SPL tokens to Omnichain Fungible Tokens
- **LayerZero Integration**: Cross-chain transfers across Ethereum, Polygon, Avalanche, BSC
- **Multi-Chain Vaults**: Include assets from multiple blockchains in single inheritance vault
- **Real Transaction Processing**: All operations generate verifiable on-chain transactions

### **💻 Enhanced User Experience**
- **Intuitive Documentation**: Comprehensive guides with left sidebar navigation, troubleshooting, and product roadmap

- **Enhanced Wallet Support**: Improved Solflare connection with QR code support and detailed error handling
- **Real-Time Asset Discovery**: Live portfolio tracking with USD valuations across supported networks
- **Streamlined Interface**: Clean navigation with focused user experience and minimal cognitive load

### **🛠️ Development & Testing**
- **Professional UI**: Modern dark/light mode interface with responsive design
- **Real-time Updates**: Live asset synchronization and transaction status tracking
- **Comprehensive Dashboard**: Portfolio overview with analytics and quick actions
- **Setup Guides**: Built-in tutorials for OFT registration and vault creation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- A Solana wallet (Solflare or Phantom)
- Basic understanding of blockchain concepts

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tatdz/willo-solana-layerzero.git
   cd willo-solana-layerzero
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Access the platform**
   Open your browser to `http://localhost:5000`

## 📋 LayerZero V2 OApp/OFT Integration

### **Why LayerZero V2 OApp/OFT Standards Matter for Inheritance**

Willo leverages LayerZero V2's latest Omnichain Application (OApp) and Omnichain Fungible Token (OFT) standards to solve the fundamental problem of cross-chain digital asset inheritance:

#### **The Inheritance Challenge**
- **Fragmented Assets**: Your digital wealth spans Ethereum (DeFi), Polygon (gaming), Avalanche (enterprise), BSC (trading)
- **Technical Complexity**: Beneficiaries need separate wallets, gas tokens, and technical knowledge for each blockchain
- **Time-Critical Claims**: Inheritance claims must be processed quickly across multiple networks simultaneously

#### **LayerZero V2 OFT Solution**
- **Universal Token Standard**: Convert SPL tokens to OFTs that exist natively on all supported chains
- **Single-Click Claims**: Beneficiaries claim on their preferred network, automatically triggering cross-chain transfers
- **Gas Abstraction**: LayerZero handles complex cross-chain messaging and token bridging automatically
- **Atomic Execution**: Inheritance claims either succeed completely across all chains or fail safely

#### **Solana + LayerZero = Optimal Architecture**
- **Solana Smart Contracts**: High-performance, low-cost inheritance logic and inactivity detection
- **LayerZero Bridging**: Seamless asset movement across 20+ blockchain networks
- **Unified Experience**: One platform manages assets across entire multi-chain ecosystem

## 📋 OFT Token Management

This platform supports creating and managing SPL tokens as LayerZero V2 Omnichain Fungible Tokens (OFT).

### Steps to Create and Register an SPL Token as OFT

#### Method 1: Using the Web Interface (Recommended)

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Choose from Solflare or Phantom wallet
   - Connect your own Solana wallet to access real blockchain functionality

2. **Create OFT Token**
   - Navigate to "OFT Token Portfolio"
   - Click "Register New OFT"
   - Fill in token details (name, symbol, decimals, supply)
   - Select target chains for cross-chain support
   - Click "Create OFT Token"

3. **Automatic Processing**
   - System requests SOL airdrop for transaction fees (devnet)
   - Creates SPL token on Solana devnet
   - Registers token with LayerZero as OFT
   - Updates your portfolio with new token

#### Method 2: Using Solana CLI (Advanced)

1. **Install Solana CLI and SPL Token CLI**
   ```bash
   # Install Solana CLI (Mac/Linux)
   sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)"
   
   # Install SPL Token CLI (requires Rust/Cargo)
   cargo install spl-token-cli
   ```

2. **Create SPL Token on Devnet**
   ```bash
   # Configure Solana CLI for devnet
   solana config set --url https://api.devnet.solana.com
   
   # Create new token
   spl-token create-token
   
   # Note the token mint address from output
   # Create token account
   spl-token create-account <TOKEN_MINT_ADDRESS>
   
   # Mint tokens to your wallet
   spl-token mint <TOKEN_MINT_ADDRESS> <AMOUNT> <YOUR_WALLET_ADDRESS>
   ```

3. **Register as OFT with LayerZero**
   ```bash
   # Use the provided LayerZero integration
   node scripts/oft-adapter-register.js --mint <TOKEN_MINT_ADDRESS> --network devnet
   ```

4. **Integrate with Vault Logic**
   - Register the token in the Willo platform
   - Add to inheritance vaults
   - Configure cross-chain transfers

## 🔗 Supported Networks

### Primary Network
- **Solana Devnet**: Primary blockchain for SPL token creation

### LayerZero Cross-Chain Support
- **Ethereum**: Mainnet and testnets
- **Polygon**: MATIC network
- **Avalanche**: AVAX C-Chain
- **BNB Chain**: Binance Smart Chain

## 🏦 Vault Management

### Creating an Inheritance Vault

1. **Basic Information**
   - Set vault name and description
   - Define inheritance rules

2. **Add OFT Assets**
   - Select registered OFT tokens
   - Specify amounts to include
   - Review total vault value

3. **Configure Beneficiaries**
   - Add beneficiary wallet addresses
   - Set inheritance conditions
   - Review and create vault

### Vault Features

- **Multi-Asset Support**: Store multiple OFT tokens in one vault
- **Cross-Chain Assets**: Include tokens from different blockchains
- **Automatic Valuation**: Real-time USD value calculation
- **Secure Storage**: Blockchain-based asset protection

## 🔄 Cross-Chain Transfers

### Initiating a Transfer

1. **Select Source Token**
   - Choose from your OFT token portfolio
   - Verify sufficient balance

2. **Choose Destination**
   - Select target blockchain
   - Enter recipient address
   - Review transfer fees

3. **Execute Transfer**
   - Confirm transaction details
   - Sign with connected wallet
   - Track transfer status

### Transfer Features

- **LayerZero Integration**: Secure cross-chain messaging
- **Fee Estimation**: Transparent cost calculation
- **Status Tracking**: Real-time transfer monitoring
- **Multi-Chain Support**: Transfer to 4+ blockchains

## 🛠️ Development Setup

### Project Structure

```
willo-solana-layerzero/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data management
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
└── README.md              # This file
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Blockchain**: Solana Web3.js, SPL Token, LayerZero SDK
- **Database**: In-memory storage with TypeScript types
- **Build**: Vite, esbuild

### Environment Configuration

The application automatically configures for:
- **Network**: Solana Devnet
- **RPC**: Public devnet endpoints
- **Wallets**: Multiple provider support
- **LayerZero**: Testnet configuration

## 🧪 Testing



### Real Wallet Testing

1. Install Solflare or Phantom wallet extension
2. Switch to Solana Devnet
3. Request SOL airdrop from faucet if needed
4. Connect to Willo platform
5. Test token creation and transfers

## 🔐 Security Considerations

- **Devnet Only**: All transactions on Solana devnet
- **Wallet Security**: Private keys never stored
- **Transaction Signing**: User confirmation required
- **Cross-Chain**: LayerZero protocol security
- **Open Source**: Code available for audit

## 📚 Documentation

### API Reference

The platform exposes RESTful APIs for:
- User management
- OFT token operations
- Vault management
- Cross-chain transfers

### Integration Guide

For developers integrating with Willo:
1. Review the shared schema definitions
2. Use provided React hooks for data fetching
3. Follow the component patterns for UI consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details


## 🎯 Roadmap

- [ ] Mainnet deployment support
- [ ] Additional wallet integrations
- [ ] Enhanced vault features
- [ ] Mobile app development
- [ ] DeFi protocol integrations

---


Built with ❤️ using Solana and LayerZero protocols.
