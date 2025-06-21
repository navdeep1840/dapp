"use client";
import AllTabs from "@/components/AllTabs";
import BalanceCard from "@/components/BalanceCard";
import Navbar from "@/components/Navbar";
import Wallet from "@/components/providers/WalletProvider";
export default function Home() {
  return (
    <Wallet>
      <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
          <main className="flex w-full flex-1 flex-col ">
            <BalanceCard />
            <AllTabs />
          </main>
        </div>
      </div>
    </Wallet>
  );
}
