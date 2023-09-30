import "./globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Gemunu_Libre } from "next/font/google";

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
      <body className="scrollbar-fix overflow-x-hidden overflow-y-scroll bg-slate-800 text-white">
        <ClientWrapper>
          <div className="max-w-content mx-auto md:grid md:grid-cols-7">
            <div className="col-span-2 ml-2">
              <div className="fixed inset-x-0 bottom-0 z-10 md:inset-x-auto md:inset-y-0 md:w-[200px] lg:w-[250px] xl:w-[300px]">
                <Sidebar />
              </div>
            </div>
            <div className="mx-2 pb-16 pt-2 md:col-span-4 md:mx-0 md:pb-0 md:pt-16 lg:col-span-3">
              {children}
            </div>
          </div>
        </ClientWrapper>
      </body>
    </html>
  );
}
