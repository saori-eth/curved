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
        className={`flex h-full w-full select-none items-center justify-center space-x-1 rounded-full p-3 transition active:scale-95 md:justify-start md:py-2 md:hover:bg-slate-700 ${isActive ? "" : "opacity-50 hover:opacity-100 md:opacity-70"
          }`}
      >
        <span className="text-2xl md:w-9">{icon}</span>
        <span className="hidden text-xl font-bold md:block">{title}</span>
      </Link>
    </li>
  );
}
