import { Quicksand } from "next/font/google";
import Link from "next/link";

const font = Quicksand({
  display: "swap",
  subsets: ["latin"],
});

export function Header() {
  return (
    <div className="md:scrollbar-fix fixed inset-x-0 z-30 md:inset-x-2">
      <div className="max-w-content mx-auto flex h-12 items-center justify-center bg-slate-800/95 pl-4 backdrop-blur-lg md:h-14 md:justify-start">
        <Link href="/" className="w-fit">
          <h2 className={`text-xl font-bold md:text-2xl ${font.className}`}>
            yuyu.social
          </h2>
        </Link>
      </div>
    </div>
  );
}
