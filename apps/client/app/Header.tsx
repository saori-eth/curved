import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex h-16 select-none items-center justify-center bg-neutral-700/90 backdrop-blur-sm">
      <div className="mx-2 grid h-min w-full max-w-5xl grid-cols-3">
        <Link href="/" className="flex cursor-pointer items-center space-x-1">
          <Image
            src="/logo.svg"
            alt="Curved Logo"
            width={30}
            height={30}
            draggable={false}
            priority
          />
          <h2 className="hidden text-2xl font-bold sm:block">Curved</h2>
        </Link>

        <div />

        <div className="flex justify-end">
          <ConnectButton accountStatus="address" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
