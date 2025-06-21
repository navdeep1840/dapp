import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { Coins, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const CreateToken = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const handleImageSelect = () => {
    if (ref.current) {
      ref.current.click();
    }
  };
  const handleCreateToken = async () => {
    if (!tokenName || !tokenSymbol || !tokenSupply) {
      alert("Please fill in all fields.");
      return;
    }

    if (!wallet.connected) {
      alert("Please connect your wallet first.");
      return;
    }

    if (isNaN(Number(tokenSupply)) || Number(tokenSupply) <= 0) {
      alert("Please enter a valid token supply.");
      return;
    }

    try {
      setLoading(true);

      const mintKeypair = Keypair.generate();

      const metadata = {
        mint: mintKeypair.publicKey,
        name: tokenName.trim(),
        symbol: tokenSymbol.trim().toUpperCase(),
        uri: image,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);

      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mintKeypair.publicKey,
          lamports,
          space: mintLen,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey!,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMint2Instruction(
          mintKeypair.publicKey,
          9,
          wallet.publicKey!,
          wallet.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: "", // Ensure this is passed correctly
          mintAuthority: wallet.publicKey!,
          updateAuthority: wallet.publicKey!,
        })
      );
      const latestBlockHash = await connection.getLatestBlockhash("finalized");

      console.log(latestBlockHash);

      transaction.feePayer = wallet.publicKey!;
      transaction.recentBlockhash = latestBlockHash.blockhash;

      transaction.partialSign(mintKeypair);

      const createMintSignature = await wallet.sendTransaction(
        transaction,
        connection
      );

      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: createMintSignature,
        },
        "confirmed"
      );

      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey!,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      console.log(`Associated Token Address: ${associatedToken.toBase58()}`);
      toast.info(`Token Address: ${associatedToken.toBase58()}`);

      const createAtaTx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey!,
          associatedToken,
          wallet.publicKey!,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      const createAtaSignature = await wallet.sendTransaction(
        createAtaTx,
        connection
      );
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: createAtaSignature,
        },
        "confirmed"
      );

      const mintToTx = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedToken,
          wallet.publicKey!,
          Number(tokenSupply) * 10 ** 9,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      const mintToSignature = await wallet.sendTransaction(
        mintToTx,
        connection
      );

      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: mintToSignature,
        },
        "confirmed"
      );

      console.log("Minted successfully!");
      toast.success("Token created successfully!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span>Create Custom Token</span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          Mint your own SPL token on the Solana blockchain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-3 block">
                Token Name
              </label>
              <Input
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="My Awesome Token"
                className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-3 block">
                Token Symbol
              </label>
              <Input
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="MAT"
                className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-3 block">
                Initial Supply
              </label>
              <Input
                value={tokenSupply}
                onChange={(e) => setTokenSupply(e.target.value)}
                placeholder="1000000"
                type="number"
                className="bg-gray-50/50 border-gray-200 rounded-2xl h-12 text-gray-800 placeholder-gray-500 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-700 text-sm font-medium mb-3 block">
              Token Logo
            </label>
            <div
              onClick={handleImageSelect}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50/30"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm font-medium">
                Upload token logo
              </p>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
              <input
                type="file"
                accept="image/*"
                ref={ref}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="mt-4">
                {image && (
                  <img
                    src={image}
                    alt="Token Logo"
                    className="w-24 h-24 rounded-full mx-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          onClick={handleCreateToken}
          disabled={loading}
          type="button"
          className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-2xl h-12 shadow-lg"
        >
          <Coins className="w-4 h-4 mr-2" />
          Create Token
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateToken;
