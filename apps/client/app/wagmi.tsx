"use client";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, Config, configureChains, createConfig } from "wagmi";
import { base, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// declare global {
//   interface Window {
//     ethereum: WindowProvider | undefined;
//   }
// }

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

const projectId = "e8f82c27482f4422f45df38f1e3c9ddc";

export const {
  chains,
  publicClient,
}: {
  chains: Chain[];
  publicClient: any;
} = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [localhost]
      : [base]),
  ],
  [publicProvider()],
);

const needsInjectedWalletFallback =
  typeof window !== "undefined" &&
  window.ethereum &&
  !window.ethereum.isMetaMask &&
  !window.ethereum.isCoinbaseWallet;

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      metaMaskWallet({ chains, projectId }),
      rainbowWallet({ chains, projectId }),
      coinbaseWallet({ appName: "yuyu.social", chains }),
      ...(needsInjectedWalletFallback ? [injectedWallet({ chains })] : []),
    ],
  },
  {
    groupName: "Other",
    wallets: [
      braveWallet({ chains }),
      walletConnectWallet({ chains, projectId }),
    ],
  },
]);

export const config: Config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
