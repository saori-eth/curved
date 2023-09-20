import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Gemunu_Libre } from "next/font/google";

import { Header } from "../components/Header";
import { Providers } from "./Providers";

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-gradient-to-b from-slate-700 to-slate-800">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
