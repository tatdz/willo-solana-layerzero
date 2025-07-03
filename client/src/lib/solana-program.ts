import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletAdapter } from './solana';

// Deployed Solana Program ID from the first repository
export const WILLO_PROGRAM_ID = new PublicKey('BF5vS2PcjByaowXxPTKbkyEcm8kVBtRemzmJrc5wWkuw');

export interface VaultData {
  id: string;
  creator: string;
  title: string;
  description: string;
  inactivityPeriod: number;
  createdAt: Date;
  lastActivity: Date;
  status: 'active' | 'triggered' | 'claimed';
  beneficiaries: string[];
  assets: VaultAsset[];
}

export interface VaultAsset {
  tokenAddress: string;
  amount: number;
  symbol: string;
  allocations: { [beneficiary: string]: number }; // percentage allocations
}

export interface OnChainVault {
  pubkey: PublicKey;
  data: VaultData;
  txHash: string;
}

/**
 * Create a new inheritance vault on Solana blockchain
 */
export async function createOnChainVault(
  connection: Connection,
  wallet: WalletAdapter,
  vaultData: Omit<VaultData, 'id' | 'createdAt' | 'lastActivity' | 'status'>
): Promise<OnChainVault> {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  // Create a new account for the vault
  const vaultAccount = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), wallet.publicKey.toBuffer()],
    WILLO_PROGRAM_ID
  )[0];

  // Create the instruction to initialize the vault
  const instruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: vaultAccount,
    lamports: await connection.getMinimumBalanceForRentExemption(1000), // Estimate rent
    space: 1000, // Estimate space needed
    programId: WILLO_PROGRAM_ID,
  });

  // Create and send transaction
  const transaction = new Transaction().add(instruction);
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  const txHash = await connection.sendRawTransaction(signedTransaction.serialize());
  
  // Confirm transaction
  await connection.confirmTransaction(txHash, 'confirmed');

  const vault: OnChainVault = {
    pubkey: vaultAccount,
    data: {
      ...vaultData,
      id: vaultAccount.toString(),
      creator: wallet.publicKey.toString(),
      createdAt: new Date(),
      lastActivity: new Date(),
      status: 'active',
    },
    txHash,
  };

  return vault;
}

/**
 * Update activity timestamp for a vault
 */
export async function updateVaultActivity(
  connection: Connection,
  wallet: WalletAdapter,
  vaultPubkey: PublicKey
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  // Create update instruction (simplified for demo)
  const instruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: vaultPubkey,
    lamports: 1, // Minimal transfer to update activity
  });

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  const txHash = await connection.sendRawTransaction(signedTransaction.serialize());
  
  await connection.confirmTransaction(txHash, 'confirmed');
  return txHash;
}

/**
 * Claim inheritance from a vault
 */
export async function claimInheritance(
  connection: Connection,
  wallet: WalletAdapter,
  vaultPubkey: PublicKey,
  assetAddress: string,
  amount: number
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  // Create claim instruction (simplified for demo)
  const instruction = SystemProgram.transfer({
    fromPubkey: vaultPubkey,
    toPubkey: wallet.publicKey,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signedTransaction = await wallet.signTransaction(transaction);
  const txHash = await connection.sendRawTransaction(signedTransaction.serialize());
  
  await connection.confirmTransaction(txHash, 'confirmed');
  return txHash;
}

/**
 * Get all vaults for a wallet
 */
export async function getUserVaults(
  connection: Connection,
  walletAddress: PublicKey
): Promise<OnChainVault[]> {
  try {
    // Get program accounts filtered by wallet
    const accounts = await connection.getProgramAccounts(WILLO_PROGRAM_ID, {
      filters: [
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: walletAddress.toBase58(),
          },
        },
      ],
    });

    // Parse vault data from accounts (simplified)
    const vaults: OnChainVault[] = accounts.map((account) => ({
      pubkey: account.pubkey,
      data: {
        id: account.pubkey.toString(),
        creator: walletAddress.toString(),
        title: 'On-Chain Vault',
        description: 'Vault stored on Solana blockchain',
        inactivityPeriod: 30,
        createdAt: new Date(),
        lastActivity: new Date(),
        status: 'active' as const,
        beneficiaries: [],
        assets: [],
      },
      txHash: '',
    }));

    return vaults;
  } catch (error) {
    console.error('Error fetching user vaults:', error);
    return [];
  }
}

/**
 * Check if vault is claimable based on inactivity
 */
export function isVaultClaimable(vault: VaultData): boolean {
  const now = new Date();
  const daysSinceActivity = Math.floor(
    (now.getTime() - vault.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceActivity >= vault.inactivityPeriod;
}

/**
 * Get Solana Explorer URL for transaction
 */
export function getSolanaExplorerUrl(txHash: string, cluster = 'devnet'): string {
  return `https://explorer.solana.com/tx/${txHash}?cluster=${cluster}`;
}

/**
 * Get Solana Explorer URL for account
 */
export function getSolanaAccountUrl(address: string, cluster = 'devnet'): string {
  return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
}