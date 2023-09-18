import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <div className="flex justify-end p-3">
      <ConnectButton accountStatus="address" showBalance={false} />
    </div>
  );
};
