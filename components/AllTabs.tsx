import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import SendSOL from "./SendSOL";
import Airdrop from "./Airdrop";
import SignMessage from "./SignMessage";
import CreateToken from "./CreateToken";

const AllTabs = () => {
  return (
    <Tabs defaultValue="send" className="w-full my-8">
      <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border-0">
        <TabsTrigger
          value="send"
          className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
        >
          Send SOL
        </TabsTrigger>
        <TabsTrigger
          value="airdrop"
          className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
        >
          Airdrop
        </TabsTrigger>
        <TabsTrigger
          value="sign"
          className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
        >
          Sign Message
        </TabsTrigger>
        <TabsTrigger
          value="token"
          className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
        >
          Create Token
        </TabsTrigger>
      </TabsList>

      <TabsContent value="send">
        <SendSOL />
      </TabsContent>
      <TabsContent value="airdrop">
        <Airdrop />
      </TabsContent>

      <TabsContent value="sign">
        <SignMessage />
      </TabsContent>

      <TabsContent value="token">
        <CreateToken />
      </TabsContent>
    </Tabs>
  );
};

export default AllTabs;
