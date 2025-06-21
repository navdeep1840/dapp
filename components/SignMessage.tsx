import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { PenTool } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
const SignMessage = () => {
  const [message, setMessage] = React.useState("");
  const { publicKey, signMessage } = useWallet();

  const handleSignMessage = async () => {
    try {
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");
      if (!publicKey) throw new Error("Wallet not connected!");

      const signed = new TextEncoder().encode(message);
      const signature = await signMessage(signed);

      console.log("Message Signature (base58):", bs58.encode(signature));
    } catch (err) {
      console.error("Message signing failed:", err);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <span>Sign Message</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Cryptographically sign any message with your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-gray-700 text-sm font-medium mb-3 block">
            Message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="bg-gray-50/50 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400 min-h-[120px] resize-none"
          />
        </div>
        <Button
          onClick={handleSignMessage}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-2xl h-12 shadow-lg"
        >
          <PenTool className="w-4 h-4 mr-2" />
          Sign Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignMessage;
