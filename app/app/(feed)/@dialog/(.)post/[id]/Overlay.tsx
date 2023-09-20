"use client";

import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function Overlay({ children }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        console.log("overlay clicked");
        router.back();
      }}
      className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
    >
      {children}
    </div>
  );
}
