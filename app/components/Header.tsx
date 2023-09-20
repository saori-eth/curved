import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex select-none justify-between bg-gradient-to-b from-slate-500/90 to-slate-600/90 p-3 shadow backdrop-blur-sm">
      <Link href="/" className="flex cursor-pointer items-center">
        <Image
          src="/logo.svg"
          alt="Curved Logo"
          width={30}
          height={30}
          draggable={false}
        />
        <h1 className="text-2xl font-bold text-white">Curved</h1>
      </Link>

      <ConnectButton accountStatus="address" showBalance={false} />
    </div>
  );
}
