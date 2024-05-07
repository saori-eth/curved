import "./globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Gemunu_Libre } from "next/font/google";

import { baseMetadata } from "./baseMetadata";
import { InstallPWA } from "./InstallPWA";
import { Sidebar } from "./Sidebar";
const ClientWrapper = dynamic(() => import("./ClientWrapper"));

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...baseMetadata,
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`overflow-y-scroll ${font.className}`}>
      <body className="bg-slate-800 text-white">
        <InstallPWA />

        <ClientWrapper>
          <div className="max-w-content relative mx-auto pb-16 md:grid md:grid-cols-7 md:gap-4 md:pb-0 md:pt-14">
            <div className="col-span-2">
              <Sidebar />
            </div>

            {children}
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
