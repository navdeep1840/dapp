"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const BalanceCard = () => {
  const [balance, setBalance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleGetBalance = async () => {
    if (!wallet.publicKey) {
      console.error("Wallet not connected");
      return;
    }
    setIsRefreshing(true);

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      console.log(`Balance: ${balance / 1e9} SOL`); // Convert lamports to SOL
      setBalance(balance / 1e9);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <div className="bg-white/80 w-full backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h3 className="text-white/90 text-sm font-medium mb-1">
              Total Balance
            </h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-white">{balance}</span>
              <span className="text-white/80 text-lg">SOL</span>
            </div>
          </div>
          <Button
            onClick={handleGetBalance}
            disabled={isRefreshing}
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-2xl"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
