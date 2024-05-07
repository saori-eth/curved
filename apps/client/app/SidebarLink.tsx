"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  href: string;
  activeRoutes?: string[];
  icon?: React.ReactNode;
}

export function SidebarLink({ title, activeRoutes, href, icon }: Props) {
  const path = usePathname();

  const isActive = activeRoutes ? activeRoutes.includes(path) : path === href;

  return (
    <li className="w-full">
      <Link
        href={href}
        draggable={false}
        className={`flex h-full w-full select-none flex-col items-center justify-center p-3 transition active:scale-95 md:flex-row md:justify-start md:space-x-1 md:rounded-full md:py-2 md:hover:bg-slate-700 ${
          isActive ? "" : "text-slate-400 md:hover:text-white"
        }`}
      >
        <span className="mt-0.5 text-2xl md:mt-0 md:w-8">{icon}</span>
        <span className="text-sm font-bold md:text-xl">{title}</span>
      </Link>
    </li>
  );
}
