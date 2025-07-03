import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const oftTokens = pgTable("oft_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mintAddress: text("mint_address").notNull().unique(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimals: integer("decimals").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).notNull().default("0"),
  isOftEnabled: boolean("is_oft_enabled").notNull().default(false),
  layerzeroId: text("layerzero_id"),
  supportedChains: text("supported_chains").array(),
  totalTransfers: integer("total_transfers").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vaults = pgTable("vaults", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, pending, completed
  totalValue: decimal("total_value", { precision: 20, scale: 8 }).notNull().default("0"),
  beneficiaries: jsonb("beneficiaries").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vaultAssets = pgTable("vault_assets", {
  id: serial("id").primaryKey(),
  vaultId: integer("vault_id").notNull().references(() => vaults.id),
  oftTokenId: integer("oft_token_id").notNull().references(() => oftTokens.id),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const crossChainTransfers = pgTable("cross_chain_transfers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  oftTokenId: integer("oft_token_id").notNull().references(() => oftTokens.id),
  fromChain: text("from_chain").notNull(),
  toChain: text("to_chain").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  recipientAddress: text("recipient_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  txHash: text("tx_hash"),
  layerzeroFee: decimal("layerzero_fee", { precision: 20, scale: 8 }),
  gasFee: decimal("gas_fee", { precision: 20, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletAddress: true,
});

export const insertOftTokenSchema = createInsertSchema(oftTokens).omit({
  id: true,
  createdAt: true,
});

export const insertVaultSchema = createInsertSchema(vaults).omit({
  id: true,
  createdAt: true,
});

export const insertVaultAssetSchema = createInsertSchema(vaultAssets).omit({
  id: true,
  addedAt: true,
});

export const insertTransferSchema = createInsertSchema(crossChainTransfers).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type OftToken = typeof oftTokens.$inferSelect;
export type InsertOftToken = z.infer<typeof insertOftTokenSchema>;

export type Vault = typeof vaults.$inferSelect;
export type InsertVault = z.infer<typeof insertVaultSchema>;

export type VaultAsset = typeof vaultAssets.$inferSelect;
export type InsertVaultAsset = z.infer<typeof insertVaultAssetSchema>;

export type CrossChainTransfer = typeof crossChainTransfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
