import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  transfer,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

export interface SolanaConfig {
  network: "mainnet-beta" | "testnet" | "devnet";
  rpcUrl: string;
}

export const SOLANA_NETWORKS: Record<string, SolanaConfig> = {
  testnet: {
    network: "testnet",
    rpcUrl: "https://api.testnet.solana.com",
  },
  mainnet: {
    network: "mainnet-beta", 
    rpcUrl: "https://api.mainnet-beta.solana.com",
  },
  devnet: {
    network: "devnet",
    rpcUrl: "https://api.devnet.solana.com",
  },
};

export interface TokenConfig {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
}

export interface WalletAdapter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export async function createSPLToken(
  connection: Connection,
  wallet: WalletAdapter,
  tokenConfig: TokenConfig
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    console.log("Creating SPL token with config:", tokenConfig);
    
    // Create a simple SPL token using high-level functions with better error handling
    const mintKeypair = Keypair.generate();
    console.log("Generated mint keypair:", mintKeypair.publicKey.toString());
    
    // Build complete transaction manually for proper wallet signing
    console.log("Building SPL token creation transaction...");
    
    // Get mint account rent
    const mintLamports = await connection.getMinimumBalanceForRentExemption(82);
    
    // Build the complete transaction
    const transaction = new Transaction();
    
    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: mintLamports,
        space: 82,
        programId: TOKEN_PROGRAM_ID,
      })
    );
    
    // Initialize mint using proper SPL token instruction
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey, // mint
        tokenConfig.decimals, // decimals
        wallet.publicKey, // mint authority
        wallet.publicKey, // freeze authority
        TOKEN_PROGRAM_ID // program id
      )
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    
    // Sign with mint keypair first
    transaction.partialSign(mintKeypair);
    
    // Sign with wallet
    console.log("Signing transaction with wallet...");
    const signedTransaction = await wallet.signTransaction(transaction);
    
    // Send transaction
    console.log("Sending SPL token creation transaction...");
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'processed',
    });
    
    // Wait for confirmation
    console.log("Waiting for transaction confirmation...");
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
    }, 'confirmed');
    
    console.log("SPL token created successfully:", mintKeypair.publicKey.toString());
    const mint = mintKeypair.publicKey;
    
    // Create associated token account and mint tokens if initial supply > 0
    if (tokenConfig.initialSupply > 0) {
      console.log("Creating associated token account and minting tokens...");
      
      // Calculate associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      
      console.log("Associated token address:", associatedTokenAddress.toString());
      
      // Build token account and mint transaction
      const mintTransaction = new Transaction();
      
      // Create associated token account instruction
      mintTransaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          associatedTokenAddress, // ata
          wallet.publicKey, // owner
          mint // mint
        )
      );
      
      // Mint tokens using proper SPL token instruction
      const mintAmount = BigInt(tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals));
      
      mintTransaction.add(
        createMintToInstruction(
          mint, // mint
          associatedTokenAddress, // destination
          wallet.publicKey, // authority
          mintAmount, // amount
          [], // multiSigners
          TOKEN_PROGRAM_ID // program id
        )
      );
      
      // Get recent blockhash for mint transaction
      const { blockhash: mintBlockhash } = await connection.getLatestBlockhash('finalized');
      mintTransaction.recentBlockhash = mintBlockhash;
      mintTransaction.feePayer = wallet.publicKey;
      
      // Sign mint transaction with wallet
      console.log("Signing token account and mint transaction...");
      const signedMintTransaction = await wallet.signTransaction(mintTransaction);
      
      // Send mint transaction
      console.log("Sending token account and mint transaction...");
      const mintSignature = await connection.sendRawTransaction(signedMintTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'processed',
      });
      
      // Wait for confirmation
      console.log("Waiting for mint transaction confirmation...");
      await connection.confirmTransaction({
        signature: mintSignature,
        blockhash: mintBlockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
      }, 'confirmed');
      
      console.log(`Successfully minted ${tokenConfig.initialSupply} ${tokenConfig.symbol} tokens to ${associatedTokenAddress.toString()}`);
    }
    
    console.log("SPL token creation completed successfully");
    return mint.toString();
    
  } catch (error) {
    console.error("Detailed error creating SPL token:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        throw new Error("Insufficient SOL balance. Please ensure you have enough SOL for transaction fees.");
      }
      if (error.message.includes('Transaction simulation failed')) {
        throw new Error("Transaction simulation failed. This may be due to network issues or insufficient funds.");
      }
      if (error.message.includes('User rejected')) {
        throw new Error("Transaction was cancelled by user.");
      }
      throw new Error(`SPL token creation failed: ${error.message}`);
    }
    
    throw new Error("SPL token creation failed with unknown error");
  }
}

export async function getTokenBalance(
  connection: Connection,
  mintAddress: string,
  walletAddress: string
): Promise<number> {
  try {
    const mint = new PublicKey(mintAddress);
    const wallet = new PublicKey(walletAddress);
    
    // Get associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, wallet);
    
    try {
      // Get token account info
      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      return Number(tokenAccount.amount);
    } catch (error) {
      // Account doesn't exist, return 0
      return 0;
    }
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0;
  }
}

export async function transferSPLToken(
  connection: Connection,
  wallet: WalletAdapter,
  mintAddress: string,
  toWallet: string,
  amount: number,
  decimals: number = 9
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    const mint = new PublicKey(mintAddress);
    const toPublicKey = new PublicKey(toWallet);
    
    // Get or create associated token accounts
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      } as any,
      mint,
      wallet.publicKey
    );
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      } as any,
      mint,
      toPublicKey
    );
    
    // Transfer tokens
    const transferAmount = amount * Math.pow(10, decimals);
    const signature = await transfer(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      } as any,
      fromTokenAccount.address,
      toTokenAccount.address,
      wallet.publicKey,
      transferAmount
    );
    
    console.log("Transfer signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error transferring SPL token:", error);
    throw new Error(`Failed to transfer SPL token: ${error}`);
  }
}

export async function requestAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number = 1
): Promise<string> {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    await connection.confirmTransaction(signature);
    console.log(`Airdropped ${amount} SOL to ${publicKey.toString()}`);
    return signature;
  } catch (error) {
    console.error("Error requesting airdrop:", error);
    throw new Error(`Failed to request airdrop: ${error}`);
  }
}

export function generateRandomTokenConfig(): TokenConfig {
  const symbols = ['WILL', 'TEST', 'DEMO', 'SPL', 'OFT'];
  const names = ['Willo Token', 'Test Token', 'Demo Token', 'SPL Token', 'OFT Token'];
  
  const randomIndex = Math.floor(Math.random() * symbols.length);
  
  return {
    name: names[randomIndex],
    symbol: symbols[randomIndex],
    decimals: 9,
    initialSupply: Math.floor(Math.random() * 1000000) + 100000, // 100k to 1M tokens
  };
}
