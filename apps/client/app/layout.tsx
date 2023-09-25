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
          <div className="max-w-content mx-auto md:grid md:grid-cols-7">
            <div className="col-span-2 mx-2 lg:mx-0">
              <div className="fixed inset-x-0 bottom-0 z-10 md:inset-x-auto md:inset-y-0 md:w-[200px] lg:w-[300px]">
                <Sidebar />
              </div>
            </div>
            <div className="mx-4 md:col-span-4 md:mx-0 md:pb-0 lg:col-span-3">
              {children}
            </div>
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
