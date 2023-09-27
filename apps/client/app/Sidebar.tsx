import { Quicksand } from "next/font/google";
import Link from "next/link";

import { SidebarItems } from "./SidebarItems";

const font = Quicksand({
  display: "swap",
  subsets: ["latin"],
});

export function Sidebar() {
  return (
    <>
      <div className="max-w-content fixed inset-x-0 mx-auto hidden h-14 items-center md:flex">
        <Link href="/" className="ml-5 hidden w-fit md:block">
          <h2 className={`text-2xl font-bold ${font.className}`}>
            yuyu.social
          </h2>
        </Link>
      </div>

      <nav className="bg-slate-800 p-2 md:px-0 md:pt-16">
        <SidebarItems />
      </nav>
    </>
  );
}
