"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactNode;
}

export function FeedButton({ href, children }: Props) {
  const path = usePathname();

  const isActive = path === href;

  return (
    <Link
      href={href}
      className={`flex w-24 items-center justify-center rounded-lg px-4 py-0.5 text-center text-slate-400 transition active:scale-95 ${
        isActive
          ? "bg-slate-700/95 text-white hover:bg-slate-600/95"
          : "hover:bg-slate-700/95"
      }`}
    >
      {children}
    </Link>
  );
}
