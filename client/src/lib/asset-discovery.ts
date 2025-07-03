import { Connection, PublicKey } from '@solana/web3.js';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  usdValue: number;
  tokenAddress: string;
  chain: 'solana' | 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
  type: 'native' | 'spl' | 'erc20';
  logo?: string;
}

export interface WalletAssets {
  walletAddress: string;
  totalUsdValue: number;
  assets: Asset[];
  lastUpdated: Date;
}

/**
 * Fetch Solana assets using Helius API
 */
async function fetchSolanaAssets(walletAddress: string): Promise<Asset[]> {
  try {
    // Primary: Helius API
    const heliusResponse = await fetch('https://api.helius.xyz/v0/addresses/balances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        addresses: [walletAddress],
      }),
    });

    if (heliusResponse.ok) {
      const data = await heliusResponse.json();
      const walletData = data[walletAddress];
      
      if (walletData) {
        const assets: Asset[] = [];

        // Add SOL balance
        if (walletData.nativeBalance > 0) {
          assets.push({
            id: 'sol',
            name: 'Solana',
            symbol: 'SOL',
            balance: walletData.nativeBalance / 1e9, // Convert lamports to SOL
            decimals: 9,
            usdValue: (walletData.nativeBalance / 1e9) * 200, // Estimate SOL price
            tokenAddress: 'So11111111111111111111111111111111111111112',
            chain: 'solana',
            type: 'native',
            logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          });
        }

        // Add SPL tokens
        if (walletData.tokens) {
          for (const token of walletData.tokens) {
            assets.push({
              id: token.mint,
              name: token.tokenAccount?.accountInfo?.tokenAmount?.uiAmount > 0 ? 'SPL Token' : 'Unknown Token',
              symbol: token.symbol || 'SPL',
              balance: token.tokenAccount?.accountInfo?.tokenAmount?.uiAmount || 0,
              decimals: token.tokenAccount?.accountInfo?.tokenAmount?.decimals || 9,
              usdValue: 0, // Would need price oracle
              tokenAddress: token.mint,
              chain: 'solana',
              type: 'spl',
            });
          }
        }

        return assets;
      }
    }
  } catch (error) {
    console.warn('Helius API failed, using fallback:', error);
  }

  // Fallback: Direct Solana RPC
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);

    if (balance > 0) {
      return [{
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        balance: balance / 1e9,
        decimals: 9,
        usdValue: (balance / 1e9) * 200,
        tokenAddress: 'So11111111111111111111111111111111111111112',
        chain: 'solana',
        type: 'native',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      }];
    }
  } catch (error) {
    console.warn('Solana RPC fallback failed:', error);
  }

  return [];
}

/**
 * Fetch EVM assets using MetaMask web3 provider
 */
async function fetchEVMAssets(walletAddress: string): Promise<Asset[]> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return [];
  }

  try {
    const ethereum = (window as any).ethereum;
    
    // Get ETH balance
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [walletAddress, 'latest'],
    });

    const ethBalance = parseInt(balance, 16) / 1e18;
    
    if (ethBalance > 0) {
      return [{
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: ethBalance,
        decimals: 18,
        usdValue: ethBalance * 3000, // Estimate ETH price
        tokenAddress: '0x0000000000000000000000000000000000000000',
        chain: 'ethereum',
        type: 'native',
        logo: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
      }];
    }
  } catch (error) {
    console.warn('EVM asset fetching failed:', error);
  }

  return [];
}

/**
 * Get all assets for a wallet across multiple chains
 */
export async function discoverWalletAssets(walletAddress: string, chains: string[] = ['solana']): Promise<WalletAssets> {
  const allAssets: Asset[] = [];
  
  // Fetch Solana assets
  if (chains.includes('solana')) {
    const solanaAssets = await fetchSolanaAssets(walletAddress);
    allAssets.push(...solanaAssets);
  }
  
  // Fetch EVM assets
  if (chains.includes('ethereum') || chains.includes('polygon') || chains.includes('bsc')) {
    const evmAssets = await fetchEVMAssets(walletAddress);
    allAssets.push(...evmAssets);
  }

  // Calculate total USD value
  const totalUsdValue = allAssets.reduce((total, asset) => total + asset.usdValue, 0);

  return {
    walletAddress,
    totalUsdValue,
    assets: allAssets,
    lastUpdated: new Date(),
  };
}

/**
 * Get cached assets or fetch fresh data
 */
export async function getWalletAssets(walletAddress: string, forceRefresh = false): Promise<WalletAssets> {
  // Check if it's a demo wallet address
  if (walletAddress === 'DemoWalletAddress1111111111111111111111111111111') {
    return getDemoAssets();
  }
  
  const cacheKey = `wallet_assets_${walletAddress}`;
  
  if (!forceRefresh) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      
      // Cache valid for 5 minutes
      if (now.getTime() - lastUpdated.getTime() < 5 * 60 * 1000) {
        return data;
      }
    }
  }

  // Fetch fresh data
  const assets = await discoverWalletAssets(walletAddress);
  
  // Cache the result
  localStorage.setItem(cacheKey, JSON.stringify(assets));
  
  return assets;
}

/**
 * Mock assets for demo mode
 */
export function getDemoAssets(): WalletAssets {
  return {
    walletAddress: 'DemoWallet1111111111111111111111111111111',
    totalUsdValue: 25847.45,
    assets: [
      {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        balance: 45.8,
        decimals: 9,
        usdValue: 5496.00,
        tokenAddress: 'So11111111111111111111111111111111111111112',
        chain: 'solana',
        type: 'native',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
      },
      {
        id: 'usdc',
        name: 'USD Coin',
        symbol: 'USDC',
        balance: 7500.0,
        decimals: 6,
        usdValue: 7500.00,
        tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        chain: 'solana',
        type: 'spl',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
      },
      {
        id: 'ray',
        name: 'Raydium',
        symbol: 'RAY',
        balance: 2850.0,
        decimals: 6,
        usdValue: 5700.00,
        tokenAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
        chain: 'solana',
        type: 'spl',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
      },
      {
        id: 'jup',
        name: 'Jupiter',
        symbol: 'JUP',
        balance: 5000.0,
        decimals: 6,
        usdValue: 4250.00,
        tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        chain: 'solana',
        type: 'spl',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png',
      },
      {
        id: 'bonk',
        name: 'Bonk',
        symbol: 'BONK',
        balance: 15000000.0,
        decimals: 5,
        usdValue: 750.00,
        tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        chain: 'solana',
        type: 'spl',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
      },
      {
        id: 'wif',
        name: 'dogwifhat',
        symbol: 'WIF',
        balance: 1200.0,
        decimals: 6,
        usdValue: 2151.45,
        tokenAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        chain: 'solana',
        type: 'spl',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png',
      },
    ],
    lastUpdated: new Date(),
  };
}

/**
 * Format asset balance for display
 */
export function formatAssetBalance(balance: number, decimals: number = 2): string {
  if (balance === 0) return '0';
  if (balance < 0.01) return '< 0.01';
  return balance.toLocaleString(undefined, { 
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals 
  });
}

/**
 * Format USD value for display
 */
export function formatUsdValue(value: number): string {
  if (value === 0) return '$0';
  if (value < 0.01) return '< $0.01';
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  });
}