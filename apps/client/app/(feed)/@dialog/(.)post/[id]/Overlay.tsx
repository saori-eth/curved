"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      onClick={() => {
        router.back();
      }}
      className={`fixed inset-0 z-10 flex items-center justify-center bg-black/75 backdrop-blur-sm transition ${mounted ? "" : "opacity-0"
        }`}
    >
      {children}
    </div>
  );
}
