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
      className={`mx-2 my-auto w-full max-w-xl rounded-2xl bg-slate-800 p-8 shadow-xl transition ${mounted ? "" : "scale-75 opacity-0"
        }`}
    >
      {children}
    </div>
  );
}
