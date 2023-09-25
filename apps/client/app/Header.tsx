import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Quicksand } from "next/font/google";
import Link from "next/link";

const font = Quicksand({
  display: "swap",
  subsets: ["latin"],
});

export function Header() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex h-16 select-none items-center justify-center bg-slate-700/90 backdrop-blur-sm">
      <div className="mx-2 grid h-min w-full max-w-5xl grid-cols-3">
        <Link href="/" className="flex cursor-pointer items-center space-x-3">
          <h2 className="text-3xl">🎉</h2>
          <h2
            className={`hidden text-2xl font-bold sm:block ${font.className}`}
          >
            yuyu.social
          </h2>
        </Link>

        <div />

        <div className="flex justify-end">
          <ConnectButton accountStatus="address" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
