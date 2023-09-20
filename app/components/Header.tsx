import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex select-none justify-center bg-neutral-700/90 p-3 backdrop-blur-sm">
      <div className="flex w-full max-w-6xl justify-between">
        <Link href="/" className="flex cursor-pointer items-center space-x-1">
          <Image
            src="/logo.svg"
            alt="Curved Logo"
            width={30}
            height={30}
            draggable={false}
          />
          <h1 className="text-2xl font-bold">Curved</h1>
        </Link>

        <ConnectButton accountStatus="address" showBalance={false} />
      </div>
    </div>
  );
}
