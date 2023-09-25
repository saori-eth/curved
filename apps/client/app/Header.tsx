import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex h-16 select-none items-center justify-center bg-slate-700/90 backdrop-blur-sm">
      <div className="mx-2 grid h-min w-full max-w-5xl grid-cols-3">
        <div />

        <div className="flex justify-end">
          <ConnectButton accountStatus="address" showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
