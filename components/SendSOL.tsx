import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
const SendSOL = () => {
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleSendToken = async () => {
    if (!sendAddress || !sendAmount) {
      alert("Please enter both address and amount");
      return;
    }

    if (!wallet.publicKey) {
      alert("Wallet not connected. Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      const amountInLamports = parseFloat(sendAmount) * 1e9; // Convert SOL to lamports

      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(sendAddress),
          lamports: amountInLamports,
        })
      );
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      setSendAddress("");
      setSendAmount("");
      alert(`Transaction successful! Tx ID: ${transaction}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Transaction failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <span>Send Solana</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Transfer SOL to any wallet address securely and instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-gray-700 text-sm font-medium mb-3 block">
            Recipient Address
          </label>
          <Input
            value={sendAddress}
            onChange={(e) => setSendAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-medium mb-3 block">
            Amount (SOL)
          </label>
          <Input
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="0.00"
            type="number"
            className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:ring-purple-400"
          />
        </div>
        <Button
          onClick={handleSendToken}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-2xl h-12 shadow-lg"
          disabled={loading}
        >
          <Send className="w-4 h-4 mr-2" />
          Send Transaction
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SendSOL;
