"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Airdrop = () => {
  const [airdropAmount, setAirdropAmount] = useState("1.0"); // Default to 1 SOL

  const wallet = useWallet();

  const { connection } = useConnection();

  const handleRequestAirdrop = async () => {
    try {
      if (wallet.publicKey) {
        const signature = await connection.requestAirdrop(
          wallet.publicKey,
          parseFloat(airdropAmount) * 1e9
        );

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });
      }
    } catch (error) {
      console.error("Error requesting airdrop:", error);
      alert("Failed to request airdrop. Please check the console for details.");
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <span>Request Airdrop</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Get free SOL tokens for development and testing on Devnet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-gray-700 text-sm font-medium mb-3 block">
            Amount (SOL)
          </label>
          <Input
            value={airdropAmount}
            onChange={(e) => setAirdropAmount(e.target.value)}
            placeholder="1.0"
            type="number"
            className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-green-400 focus:ring-green-400"
          />
        </div>
        <Button
          onClick={handleRequestAirdrop}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 rounded-2xl h-12 shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Request Airdrop
        </Button>
      </CardContent>
    </Card>
  );
};

export default Airdrop;
