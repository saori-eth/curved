import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const Header = () => {
  return (
    <div className="glossy flex justify-between p-3 fixed top-0 left-0 right-0 z-10 no-highlight">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Curved Logo" width={30} height={30} />
        <h1 className="text-2xl font-bold text-white">Curved</h1>
      </div>
      <ConnectButton accountStatus="address" showBalance={false} />
    </div>
  );
};
