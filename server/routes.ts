import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertOftTokenSchema, insertVaultSchema, insertTransferSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByWallet(userData.walletAddress);
      
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // OFT Token routes
  app.get("/api/users/:userId/oft-tokens", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tokens = await storage.getOftTokensByUser(userId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch OFT tokens" });
    }
  });

  app.post("/api/oft-tokens", async (req, res) => {
    try {
      const tokenData = insertOftTokenSchema.parse(req.body);
      
      // Check if user exists, create if not
      let user = await storage.getUser(tokenData.userId);
      if (!user) {
        // For demo or missing user, create a default user
        const walletAddress = req.body.walletAddress || 'DemoWallet1111111111111111111111111111111';
        user = await storage.createUser({
          walletAddress,
          username: `User_${Date.now()}`
        });
        // Update token data with correct user ID
        tokenData.userId = user.id;
      }
      
      const token = await storage.createOftToken(tokenData);
      res.json(token);
    } catch (error) {
      console.error('OFT Token creation error:', error);
      res.status(400).json({ error: "Failed to create OFT token" });
    }
  });

  app.patch("/api/oft-tokens/:id/balance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { balance } = z.object({ balance: z.string() }).parse(req.body);
      const token = await storage.updateOftTokenBalance(id, balance);
      
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      
      res.json(token);
    } catch (error) {
      res.status(400).json({ error: "Invalid balance data" });
    }
  });

  // Vault routes
  app.get("/api/users/:userId/vaults", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vaults = await storage.getVaultsByUser(userId);
      res.json(vaults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vaults" });
    }
  });

  app.post("/api/vaults", async (req, res) => {
    try {
      const vaultData = insertVaultSchema.parse(req.body);
      const vault = await storage.createVault(vaultData);
      res.json(vault);
    } catch (error) {
      res.status(400).json({ error: "Invalid vault data" });
    }
  });

  // Transfer routes
  app.get("/api/users/:userId/transfers", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transfers = await storage.getTransfersByUser(userId);
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfers" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const transferData = insertTransferSchema.parse(req.body);
      const transfer = await storage.createTransfer(transferData);
      res.json(transfer);
    } catch (error) {
      res.status(400).json({ error: "Invalid transfer data" });
    }
  });

  app.patch("/api/transfers/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, txHash } = z.object({ 
        status: z.string(), 
        txHash: z.string().optional() 
      }).parse(req.body);
      
      const transfer = await storage.updateTransferStatus(id, status, txHash);
      
      if (!transfer) {
        return res.status(404).json({ error: "Transfer not found" });
      }
      
      res.json(transfer);
    } catch (error) {
      res.status(400).json({ error: "Invalid status data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
