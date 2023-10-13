"use client";

import { useRouter } from "next/navigation";
import { MdSync } from "react-icons/md";

export function RefreshButton() {
  const router = useRouter();

  return (
    <button
      title="Refresh"
      onClick={() => router.refresh()}
      className="absolute right-2 p-1 text-slate-400 transition active:text-white md:hover:text-white md:active:opacity-80"
    >
      <MdSync />
    </button>
  );
}
