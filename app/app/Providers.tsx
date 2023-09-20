"use client";

import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import * as React from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { base } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const localhost = {
  id: 9_999,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  network: "localhost",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [localhost] : []),
  ],
  [publicProvider()],
);

const projectId = "e8f82c27482f4422f45df38f1e3c9ddc";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  chains,
  projectId,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains, projectId }),
      trustWallet({ chains, projectId }),
      ledgerWallet({ chains, projectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={demoAppInfo}
        theme={darkTheme({
          borderRadius: "small",
          overlayBlur: "large",
        })}
        modalSize="compact"
      >
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
