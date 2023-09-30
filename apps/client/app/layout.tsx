import "./globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Gemunu_Libre } from "next/font/google";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const ClientWrapper = dynamic(() => import("./ClientWrapper"));

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

const title = "yuyu.social";
const description = "Welcome to yuyu.social!";

export const metadata: Metadata = {
  applicationName: title,
  description,
  openGraph: {
    description,
    title,
    type: "website",
  },
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
      <body className="md:scrollbar-fix overflow-x-hidden overflow-y-scroll bg-slate-800 text-white">
        <ClientWrapper>
          <Header />

          <div className="max-w-content mx-auto md:grid md:grid-cols-7 md:gap-8">
            <div className="col-span-2">
              <Sidebar />
            </div>
            <div className="z-20 col-span-4 py-16 md:pb-0">{children}</div>
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
