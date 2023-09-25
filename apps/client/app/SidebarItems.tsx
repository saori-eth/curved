"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import { CreatePost } from "./(feed)/CreatePost";
import { useAuth } from "./AuthProvider";
import { SidebarButton } from "./SidebarButton";
import { SidebarLink } from "./SidebarLink";

export function SidebarItems() {
  const { status, logout, user } = useAuth();
  const { openConnectModal } = useConnectModal();

  return (
    <ul className="flex md:block md:space-y-1">
      <SidebarLink href="/" title="Home" icon="🏠" />

      {status === "authenticated" ? (
        <>
          <SidebarLink href="/rewards" title="Rewards" icon="🎁" />
          <SidebarLink href={`/@${user?.username}`} title="Profile" icon="👤" />

          <SidebarButton onClick={logout} title="Logout" icon="🚪" />

          <div className="hidden pt-4 md:block">
            <CreatePost />
          </div>
        </>
      ) : (
        <SidebarButton onClick={openConnectModal} title="Login" icon="🔑" />
      )}
    </ul>
  );
}
