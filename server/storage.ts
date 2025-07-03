import { 
  users, oftTokens, vaults, vaultAssets, crossChainTransfers,
  type User, type InsertUser, type OftToken, type InsertOftToken,
  type Vault, type InsertVault, type VaultAsset, type InsertVaultAsset,
  type CrossChainTransfer, type InsertTransfer
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // OFT Token methods
  getOftTokensByUser(userId: number): Promise<OftToken[]>;
  getOftToken(id: number): Promise<OftToken | undefined>;
  createOftToken(token: InsertOftToken): Promise<OftToken>;
  updateOftTokenBalance(id: number, balance: string): Promise<OftToken | undefined>;

  // Vault methods
  getVaultsByUser(userId: number): Promise<(Vault & { assets: (VaultAsset & { token: OftToken })[] })[]>;
  getVault(id: number): Promise<Vault | undefined>;
  createVault(vault: InsertVault): Promise<Vault>;
  addAssetToVault(asset: InsertVaultAsset): Promise<VaultAsset>;

  // Transfer methods
  getTransfersByUser(userId: number): Promise<CrossChainTransfer[]>;
  createTransfer(transfer: InsertTransfer): Promise<CrossChainTransfer>;
  updateTransferStatus(id: number, status: string, txHash?: string): Promise<CrossChainTransfer | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private oftTokens: Map<number, OftToken>;
  private vaults: Map<number, Vault>;
  private vaultAssets: Map<number, VaultAsset>;
  private transfers: Map<number, CrossChainTransfer>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.oftTokens = new Map();
    this.vaults = new Map();
    this.vaultAssets = new Map();
    this.transfers = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getOftTokensByUser(userId: number): Promise<OftToken[]> {
    return Array.from(this.oftTokens.values()).filter(
      (token) => token.userId === userId
    );
  }

  async getOftToken(id: number): Promise<OftToken | undefined> {
    return this.oftTokens.get(id);
  }

  async createOftToken(insertToken: InsertOftToken): Promise<OftToken> {
    const id = this.currentId++;
    const token: OftToken = { 
      ...insertToken, 
      id, 
      balance: insertToken.balance || "0",
      isOftEnabled: insertToken.isOftEnabled || false,
      layerzeroId: insertToken.layerzeroId || null,
      supportedChains: insertToken.supportedChains || null,
      totalTransfers: insertToken.totalTransfers || 0,
      createdAt: new Date()
    };
    this.oftTokens.set(id, token);
    return token;
  }

  async updateOftTokenBalance(id: number, balance: string): Promise<OftToken | undefined> {
    const token = this.oftTokens.get(id);
    if (token) {
      const updatedToken = { ...token, balance };
      this.oftTokens.set(id, updatedToken);
      return updatedToken;
    }
    return undefined;
  }

  async getVaultsByUser(userId: number): Promise<(Vault & { assets: (VaultAsset & { token: OftToken })[] })[]> {
    const userVaults = Array.from(this.vaults.values()).filter(
      (vault) => vault.userId === userId
    );

    return userVaults.map(vault => {
      const assets = Array.from(this.vaultAssets.values())
        .filter(asset => asset.vaultId === vault.id)
        .map(asset => {
          const token = this.oftTokens.get(asset.oftTokenId);
          return { ...asset, token: token! };
        });
      return { ...vault, assets };
    });
  }

  async getVault(id: number): Promise<Vault | undefined> {
    return this.vaults.get(id);
  }

  async createVault(insertVault: InsertVault): Promise<Vault> {
    const id = this.currentId++;
    const vault: Vault = { 
      ...insertVault, 
      id, 
      status: insertVault.status || "pending",
      description: insertVault.description || null,
      totalValue: insertVault.totalValue || "0",
      beneficiaries: insertVault.beneficiaries || [],
      createdAt: new Date()
    };
    this.vaults.set(id, vault);
    return vault;
  }

  async addAssetToVault(insertAsset: InsertVaultAsset): Promise<VaultAsset> {
    const id = this.currentId++;
    const asset: VaultAsset = { 
      ...insertAsset, 
      id, 
      addedAt: new Date()
    };
    this.vaultAssets.set(id, asset);
    return asset;
  }

  async getTransfersByUser(userId: number): Promise<CrossChainTransfer[]> {
    return Array.from(this.transfers.values()).filter(
      (transfer) => transfer.userId === userId
    );
  }

  async createTransfer(insertTransfer: InsertTransfer): Promise<CrossChainTransfer> {
    const id = this.currentId++;
    const transfer: CrossChainTransfer = { 
      ...insertTransfer, 
      id, 
      status: insertTransfer.status || "pending",
      txHash: insertTransfer.txHash || null,
      layerzeroFee: insertTransfer.layerzeroFee || null,
      gasFee: insertTransfer.gasFee || null,
      createdAt: new Date()
    };
    this.transfers.set(id, transfer);
    return transfer;
  }

  async updateTransferStatus(id: number, status: string, txHash?: string): Promise<CrossChainTransfer | undefined> {
    const transfer = this.transfers.get(id);
    if (transfer) {
      const updatedTransfer = { ...transfer, status, txHash: txHash || transfer.txHash };
      this.transfers.set(id, updatedTransfer);
      return updatedTransfer;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
