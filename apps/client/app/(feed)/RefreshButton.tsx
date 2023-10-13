"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MdSync } from "react-icons/md";

export function RefreshButton() {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  function refresh() {
    if (pending) {
      return;
    }

    startTransition(async () => {
      router.refresh();
      await new Promise((r) => setTimeout(r, 120));
    });
  }

  return (
    <button
      title="Refresh"
      onClick={refresh}
      className={`absolute right-2 p-1 text-slate-400 transition duration-300 ${pending
        ? "-rotate-180 text-slate-600"
        : "active:text-white md:hover:text-white md:active:opacity-80 "
        }`}
    >
      <MdSync />
    </button>
  );
}
