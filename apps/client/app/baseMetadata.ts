import { Metadata } from "next";

import { env } from "@/lib/env.mjs";

const title = "yuyu.social";
const description = "Welcome to yuyu.social!";
const images = [
  {
    height: 512,
    type: "image/png",
    url: `${env.NEXT_PUBLIC_DEPLOYED_URL}/images/android-chrome-512x512.png`,
    width: 512,
  },
];

export const baseMetadata = {
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
  metadataBase: new URL(env.NEXT_PUBLIC_DEPLOYED_URL),
  openGraph: {
    description,
    images,
    siteName: title,
    title,
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
} as const satisfies Metadata;
