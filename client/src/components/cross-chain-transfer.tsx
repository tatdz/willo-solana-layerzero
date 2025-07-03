import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet-provider";
import { useToast } from "@/hooks/use-toast";

export function CrossChainTransfer() {
  const { walletAddress, walletType } = useWallet();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [toChain, setToChain] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const { data: user } = useQuery({
    queryKey: [`/api/users/${walletAddress}`],
    enabled: !!walletAddress,
  });

  const { data: tokens = [] } = useQuery({
    queryKey: [`/api/users/${user && typeof user === 'object' && user && 'id' in user ? (user as any).id : ''}/oft-tokens`],
    enabled: !!(user && typeof user === 'object' && 'id' in user && (user as any).id),
  });

  const oftTokens = Array.isArray(tokens) ? (tokens as any[]).filter((token: any) => token.isOftEnabled) : [];

  const supportedChains = [
    { id: "ethereum", name: "Ethereum" },
    { id: "polygon", name: "Polygon" },
    { id: "avalanche", name: "Avalanche" },
    { id: "bnb", name: "BNB Chain" },
  ];

  const selectedTokenData = oftTokens.find((token: any) => token.id.toString() === selectedToken);
  const estimatedFee = amount ? (parseFloat(amount) * 0.002).toFixed(6) : "0.00";
  const gasFee = "2.45";

  const handleMaxClick = () => {
    if (selectedTokenData) {
      setAmount(selectedTokenData.balance);
    }
  };

  const handleTransfer = async () => {
    // Real wallets only - no demo simulation

    // Real LayerZero transfer logic would go here
    console.log("Initiating transfer:", {
      token: selectedToken,
      amount,
      toChain,
      recipientAddress,
    });
    
    toast({
      title: "Transfer Not Available",
      description: "Cross-chain transfers are currently only available in demo mode",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Cross-Chain Transfer</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <i className="fas fa-info-circle"></i>
          <span>Powered by LayerZero</span>
        </div>
      </div>

      {/* Why Cross-Chain Transfer Explanation */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-purple-900 mb-2 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Why Cross-Chain Transfers Matter for Inheritance
        </h4>
        <div className="text-purple-800 text-sm space-y-2">
          <p><strong>Beneficiary Flexibility:</strong> Recipients can receive inheritance on their preferred blockchain (Ethereum, Polygon, etc.)</p>
          <p><strong>No Technical Barriers:</strong> Beneficiaries don't need Solana wallets - they can claim using MetaMask on Ethereum</p>
          <p><strong>Gas Efficiency:</strong> LayerZero automatically handles cross-chain execution with minimal fees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="token-select">Select OFT Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger id="token-select" className="mt-2">
                <SelectValue placeholder="Choose an OFT token" />
              </SelectTrigger>
              <SelectContent>
                {oftTokens.map((token: any) => (
                  <SelectItem key={token.id} value={token.id.toString()}>
                    {token.name} ({token.symbol}) - {parseFloat(token.balance).toLocaleString()} available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
              >
                MAX
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Chain</Label>
              <div className="mt-2 border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                  <span className="font-medium">Solana</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="to-chain">To Chain</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger id="to-chain" className="mt-2">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter destination address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-4">Transfer Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="text-gray-900">
                  {amount || "0.00"} {selectedTokenData?.symbol || "TOKEN"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">LayerZero Fee</span>
                <span className="text-gray-900">{estimatedFee} SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gas Fee (Est.)</span>
                <span className="text-gray-900">${gasFee}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-semibold">
                <span>Total Cost</span>
                <span>${(parseFloat(gasFee) + parseFloat(estimatedFee) * 150).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-blue-800">Cross-Chain Transfer Info</p>
                <p className="text-blue-700 mt-1">
                  This transfer will use LayerZero protocol. Estimated completion time: 2-5 minutes.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleTransfer}
            disabled={!selectedToken || !amount || !toChain || !recipientAddress}
            className="w-full gradient-primary text-white hover:opacity-90 disabled:opacity-50"
          >
            Initiate Transfer
          </Button>
        </div>
      </div>
    </Card>
  );
}
