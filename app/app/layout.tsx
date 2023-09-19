import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Header } from "../components/Header";
import { Handjet } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const font = Handjet({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface Props {
  children: React.ReactNode;
}

function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={font.className}>
      <body
        style={{
          background:
            "linear-gradient(to bottom, #35465C 0%, #35465C 5%, #2A3A4C 15%, #2A3A4C 100%)",
        }}
        className="sm:px-6 lg:px-8 overflow-hidden"
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
