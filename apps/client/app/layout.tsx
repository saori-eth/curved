import "./globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Gemunu_Libre } from "next/font/google";

import { env } from "@/lib/env.mjs";

import { Sidebar } from "./Sidebar";

const ClientWrapper = dynamic(() => import("./ClientWrapper"));

const font = Gemunu_Libre({
  display: "swap",
  subsets: ["latin"],
});

const title = "yuyu.social";
const description = "Welcome to yuyu.social!";
const images = [
  {
    height: 512,
    type: "image/png",
    url: "/images/android-chrome-512x512.png",
    width: 512,
  },
];

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    startupImage: {
      url: "/images/android-chrome-512x512.png",
    },
    title,
  },
  applicationName: title,
  colorScheme: "dark",
  description,
  formatDetection: {
    telephone: false,
  },
  keywords: ["Web3", "Social"],
  metadataBase: new URL(env.NEXT_PUBLIC_DEPLOYED_URL),
  openGraph: {
    description,
    images,
    siteName: title,
    title,
    type: "website",
  },
  themeColor: "#1e293b",
  title: { default: title, template: "%s • yuyu.social" },
  twitter: {
    card: "summary",
    description,
    images,
    site: "@yuyu_social",
    title,
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`overflow-y-scroll ${font.className}`}>
      <body className="bg-slate-800 text-white">
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
