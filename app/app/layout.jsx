import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Header } from "../components";
import { Body } from "../components";

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <Body>{children}</Body>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
