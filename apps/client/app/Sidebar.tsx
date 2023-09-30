"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";

import Avatar from "@/components/Avatar";

import { CreatePost } from "./(feed)/CreatePost";
import { useAuth } from "./AuthProvider";
import { SidebarButton } from "./SidebarButton";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
  const { status, logout, user } = useAuth();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="md:fixed md:inset-0 md:mx-2">
      <div className="max-w-content fixed inset-x-0 bottom-0 md:absolute md:inset-0 md:mx-auto md:grid md:grid-cols-7 md:gap-8">
        <ul className="relative flex space-x-1 bg-slate-800 p-2 md:col-span-2 md:block md:h-full md:space-x-0 md:space-y-1 md:p-0 md:pt-16">
          <SidebarLink href="/" title="Home" icon="🏠" />

          {status === "authenticated" && user ? (
            <>
              <SidebarLink href="/following" title="Following" icon="👥" />
              <SidebarLink href="/rewards" title="Rewards" icon="🎁" />
              <SidebarLink
                href={`/@${user.username}`}
                title="Profile"
                icon={
                  <Avatar
                    size={24}
                    src={user.avatar}
                    uniqueKey={user.username}
                  />
                }
              />

              <li className="hidden pt-4 md:block">
                <CreatePost />
              </li>

              <div className="w-full md:absolute md:inset-x-0 md:bottom-4">
                <SidebarButton onClick={logout} title="Logout" icon="🚪" />
              </div>
            </>
          ) : (
            <SidebarButton onClick={openConnectModal} title="Login" icon="🔑" />
          )}
        </ul>
      </div>
    </div>
  );
}
