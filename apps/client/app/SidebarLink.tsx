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
        className={`flex h-full w-full select-none items-center justify-center space-x-1 rounded-xl py-4 transition active:scale-95 md:justify-start md:px-4 md:py-2 ${isActive
            ? "md:bg-slate-700 md:hover:bg-slate-600"
            : "opacity-30 hover:opacity-100 md:opacity-100 md:hover:bg-slate-700"
          }`}
      >
        <span className="text-2xl md:w-9">{icon}</span>
        <span className="hidden text-xl font-bold md:block">{title}</span>
      </Link>
    </li>
  );
}
