import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const Header = () => {
  return (
    <div className="flex justify-between p-3">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Curved Logo" width={30} height={30} />
        <h1 className="text-2xl font-bold">Curved</h1>
      </div>
      <ConnectButton accountStatus="address" showBalance={false} />
    </div>
  );
};
