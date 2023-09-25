import Link from "next/link";

interface Props {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

export function SidebarLink({ title, href, icon }: Props) {
  return (
    <li className="w-full">
      <Link
        href={href}
        draggable={false}
        className="flex h-full w-full select-none items-center justify-center space-x-3 rounded-xl px-4 py-2 text-xl font-bold transition hover:bg-slate-700 active:scale-95 md:justify-start"
      >
        <span>{icon}</span>
        <span className="hidden md:block">{title}</span>
      </Link>
    </li>
  );
}
