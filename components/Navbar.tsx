import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Coins } from "lucide-react";

const Navbar = () => {
  return (
    <div className="relative z-10 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Coins className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Solana LaunchPad
            </h1>
            <p className="text-gray-600 text-sm">Web3 Development Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200 px-3 py-1"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Devnet
          </Badge> */}
          <div className="">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
