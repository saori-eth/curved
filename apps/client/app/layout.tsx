import "./globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Gemunu_Libre } from "next/font/google";

import { Sidebar } from "./Sidebar";

const ClientWrapper = dynamic(() => import("./ClientWrapper"), { ssr: false });

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

const title = "yuyu.social";
const description = "Welcome to yuyu.social!";

export const metadata: Metadata = {
  description,
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
      <body className="bg-slate-800 text-white">
        <ClientWrapper>
          <div className="max-w-content mx-auto md:grid md:grid-cols-7 md:gap-8">
            <div className="fixed inset-x-0 bottom-0 z-20 bg-slate-800/90 py-2 backdrop-blur md:relative md:inset-x-auto md:bottom-auto md:z-auto md:col-span-2 md:bg-inherit md:py-2 md:backdrop-blur-none">
              <Sidebar />
            </div>
            <div className="pb-16 md:col-span-3 md:pb-0">{children}</div>
            <div className="md:col-span-2" />
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
