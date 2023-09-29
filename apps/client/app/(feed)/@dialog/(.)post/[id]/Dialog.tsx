"use client";

import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export function Dialog({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`max-w-content mx-2 my-auto h-2/3 w-full rounded-2xl bg-slate-800 p-8 shadow-xl transition ${
        mounted ? "" : "scale-75 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
