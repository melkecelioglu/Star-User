import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { useRouter } from "next/router";
import { Roboto, Space_Mono } from "next/font/google";
import { ChatbotProvider } from "@/context/ChatbotContext";
import Head from "next/head";

const { chains, publicClient } = configureChains(
  [ sepolia],
  [publicProvider()]
);

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to my RainbowKit app",
});

const { connectors } = getDefaultWallets({
  appName: "vuzztestnet",
  projectId: "772676aefab9152731d54b860d08977a",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const space = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isIndexPage = router.pathname === "/create" || router.pathname === "/";

  return (
    <div className={`${space.className}`}>
       <Head >
        <title>VuzzMind Testnet</title>
      </Head>
      {!isIndexPage && <Navbar />}
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <RainbowKitProvider chains={chains}>
            <Toaster />
           <ChatbotProvider>
              <Component {...pageProps} />
          </ChatbotProvider>
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiConfig>
    </div>
  );
}
