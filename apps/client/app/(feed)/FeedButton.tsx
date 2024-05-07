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
      className={`rounded-lg px-4 py-1 transition active:scale-95 md:hover:text-white ${
        isActive ? "font-bold" : "text-slate-400"
      }`}
    >
      {children}
    </Link>
  );
}
