import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Metadata } from "next";
import { Gemunu_Libre } from "next/font/google";

import { Header } from "../components/Header";
import { Providers } from "./Providers";

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

const title = "Curved";
const description = "Welcome to Curved!";

export const metadata: Metadata = {
  description,
  icons: "/logo.svg",
  openGraph: {
    description,
    title,
    type: "website",
  },
  themeColor: "#000000",
  title,
  twitter: {
    card: "summary",
    description,
    title,
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-neutral-800 px-4 text-white">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
