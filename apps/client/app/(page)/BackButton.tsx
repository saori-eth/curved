"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

export function BackButton() {
  const router = useRouter();

  function back() {
    router.back();
  }

  return (
    <button
      onClick={back}
      className="text-slate-300 active:text-white md:hover:text-white"
    >
      <BiArrowBack className="text-lg" />
    </button>
  );
}
