import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Header } from "../components";
import { Handjet } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const font = Handjet({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function RootLayout({ children }) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-gradient-to-r from-blue-400 to-purple-500 sm:px-6 lg:px-8 bg-attachment-fixed h-screen overflow-x-hidden no-scrollbar">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
