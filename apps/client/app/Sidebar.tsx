"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Quicksand } from "next/font/google";
import Link from "next/link";

import Avatar from "@/components/Avatar";

import { CreatePost } from "./(feed)/CreatePost";
import { useAuth } from "./AuthProvider";
import { SidebarButton } from "./SidebarButton";
import { SidebarLink } from "./SidebarLink";

const font = Quicksand({
  display: "swap",
  subsets: ["latin"],
});

export function Sidebar() {
  const { status, user } = useAuth();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="md:fixed md:inset-0 md:mx-4">
      <div className="max-w-content fixed inset-x-0 bottom-0 z-50 md:absolute md:inset-0 md:mx-auto md:grid md:grid-cols-7 md:gap-4">
        <ul className="relative flex bg-slate-800/95 pb-2 backdrop-blur-lg md:col-span-2 md:block md:h-full md:space-x-0 md:space-y-2 md:p-0">
          <div className="mt-1 hidden h-14 items-center pl-4 md:flex">
            <Link href="/" className="w-fit">
              <h2 className={`text-xl font-bold md:text-2xl ${font.className}`}>
                yuyu.social
              </h2>
            </Link>
          </div>

          <SidebarLink
            href="/"
            activeRoutes={["/", "/following"]}
            title="Home"
            icon="🏠"
          />

          {status === "authenticated" && user ? (
            <>
              <span className="flex w-full items-center justify-center md:hidden">
                <CreatePost />
              </span>

              <SidebarLink
                href={`/@${user.username}`}
                title="Profile"
                icon={
                  <Avatar
                    size={32}
                    src={user.avatar}
                    uniqueKey={user.username}
                  />
                }
              />

              <span className="hidden pt-4 md:block">
                <CreatePost />
              </span>

              <div className="hidden w-full md:absolute md:inset-x-0 md:bottom-4 md:block">
                <SidebarLink href="/settings" title="Settings" icon="⚙️" />
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
