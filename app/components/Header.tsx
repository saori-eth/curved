import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex justify-between p-3 fixed top-0 left-0 right-0 z-10 select-none bg-gradient-to-b from-white/20 to-white/5 shadow">
      <Link href="/" className="flex items-center cursor-pointer">
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
};
