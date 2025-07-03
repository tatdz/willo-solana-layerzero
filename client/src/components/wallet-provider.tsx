import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export type WalletType = "solflare" | "phantom";

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  walletAddress: string | null;
  walletType: WalletType | null;
  connection: Connection;
  publicKey: PublicKey | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}



export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  
  // Use devnet for testing
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const connectSolflare = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Check specifically for Solflare wallet
        const provider = (window as any).solflare;
        
        if (!provider) {
          const userChoice = confirm(
            "Solflare wallet not detected. Would you like to:\n" +
            "• Install Solflare browser extension\n" +
            "• Use Solflare mobile app with QR code\n" +
            "\nClick OK to open Solflare website, or Cancel to try again."
          );
          
          if (userChoice) {
            window.open('https://solflare.com/', '_blank');
          }
          return false;
        }

        // Check if already connected
        if (provider.isConnected && provider.publicKey) {
          setConnected(true);
          setWalletAddress(provider.publicKey.toString());
          setWalletType("solflare");
          setPublicKey(new PublicKey(provider.publicKey.toString()));
          alert(`Connected to Solflare!\nWallet Address: ${provider.publicKey.toString()}`);
          return true;
        }

        // Request connection with proper options
        const response = await provider.connect({
          onlyIfTrusted: false
        });
        
        if (response && response.publicKey) {
          setConnected(true);
          setWalletAddress(response.publicKey.toString());
          setWalletType("solflare");
          setPublicKey(new PublicKey(response.publicKey.toString()));
          alert(`Successfully connected to Solflare!\nWallet Address: ${response.publicKey.toString()}`);
          return true;
        } else if (provider.publicKey) {
          // Alternative method if direct response doesn't work
          setConnected(true);
          setWalletAddress(provider.publicKey.toString());
          setWalletType("solflare");
          setPublicKey(new PublicKey(provider.publicKey.toString()));
          alert(`Successfully connected to Solflare!\nWallet Address: ${provider.publicKey.toString()}`);
          return true;
        }
      } catch (error: any) {
        if (error.code === 4001) {
          alert("Connection cancelled. Please approve the connection to continue.");
        } else if (error.code === -32603) {
          alert("Wallet is locked. Please unlock your Solflare wallet and try again.");
        } else {
          console.error("Solflare connection error:", error);
          alert(
            "Connection failed. Please try:\n" +
            "• Unlock your Solflare wallet\n" +
            "• Refresh the page\n" +
            "• Use Solflare mobile app with QR code scanning\n" +
            "Error: " + (error.message || error.toString())
          );
        }
      }
    }
    return false;
  };

  const connectPhantom = async () => {
    if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
      try {
        const resp = await (window as any).phantom.solana.connect();
        setConnected(true);
        setWalletAddress(resp.publicKey.toString());
        setWalletType("phantom");
        setPublicKey(new PublicKey(resp.publicKey.toString()));
        return true;
      } catch (error) {
        console.error("Phantom connection failed:", error);
        return false;
      }
    }
    return false;
  };



  const connect = async (type: WalletType) => {
    setConnecting(true);
    try {
      let success = false;
      
      switch (type) {
        case "solflare":
          success = await connectSolflare();
          break;
        case "phantom":
          success = await connectPhantom();
          break;
      }

      if (!success) {
        throw new Error(`Failed to connect to ${type} wallet`);
      }
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setWalletAddress(null);
    setWalletType(null);
    setPublicKey(null);
    
    // Disconnect from the actual wallet if connected
    if (typeof window !== 'undefined') {
      if ((window as any).solflare?.isConnected) {
        (window as any).solflare.disconnect();
      }
      if ((window as any).phantom?.solana?.isConnected) {
        (window as any).phantom.solana.disconnect();
      }
    }
  };

  const signTransaction = async (transaction: any) => {
    if (!connected || !walletType) {
      throw new Error("Wallet not connected");
    }

    if (walletType === "solflare" && (window as any).solflare) {
      return await (window as any).solflare.signTransaction(transaction);
    }

    if (walletType === "phantom" && (window as any).phantom?.solana) {
      return await (window as any).phantom.solana.signTransaction(transaction);
    }

    throw new Error("Unable to sign transaction");
  };

  const signAllTransactions = async (transactions: any[]) => {
    if (!connected || !walletType) {
      throw new Error("Wallet not connected");
    }

    if (walletType === "solflare" && (window as any).solflare) {
      return await (window as any).solflare.signAllTransactions(transactions);
    }

    if (walletType === "phantom" && (window as any).phantom?.solana) {
      return await (window as any).phantom.solana.signAllTransactions(transactions);
    }

    throw new Error("Unable to sign transactions");
  };

  useEffect(() => {
    // Auto-connect if wallet was previously connected
    const tryAutoConnect = async () => {
      if (typeof window !== 'undefined') {
        if ((window as any).solflare?.isConnected) {
          await connectSolflare();
        } else if ((window as any).phantom?.solana?.isConnected) {
          await connectPhantom();
        }
      }
    };
    
    tryAutoConnect();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        walletAddress,
        walletType,
        connection,
        publicKey,
        connect,
        disconnect,
        signTransaction,
        signAllTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
