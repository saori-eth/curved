import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#1e293b",
    description: "An awesome social network",
    display: "standalone",
    icons: [
      {
        sizes: "32x32",
        src: "/images/favicon-32x32.png",
        type: "image/png",
      },
      {
        sizes: "16x16",
        src: "/images/favicon-16x16.png",
        type: "image/png",
      },
      {
        sizes: "192x192",
        src: "/images/android-chrome-192x192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/images/android-chrome-512x512.png",
        type: "image/png",
      },
      {
        sizes: "180x180",
        src: "/images/apple-touch-icon.png",
        type: "image/png",
      },
      {
        sizes: "256x256",
        src: "/images/icon-256x256.png",
        type: "image/png",
      },
      {
        sizes: "384x384",
        src: "/images/icon-384x384.png",
        type: "image/png",
      },
    ],
    name: "yuyu.social",
    short_name: "yuyu",
    start_url: "/",
    theme_color: "#1e293b",
  };
}
