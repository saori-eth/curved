"use client";

import { useTransition } from "react";

import { useAuth } from "../AuthProvider";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  const { logout } = useAuth();

  function handleLogout() {
    if (pending) return;

    startTransition(async () => {
      const success = await logout();
      if (success) {
        window.location.href = "/";
      }
    });
  }

  return (
    <button
      disabled={pending}
      onClick={handleLogout}
      className={`w-full rounded-full border border-slate-700 py-2 text-lg font-semibold text-slate-200 transition ${pending
          ? "opacity-50"
          : "hover:border-slate-600 hover:bg-slate-700 hover:text-white active:opacity-90"
        }`}
    >
      Log out
    </button>
  );
}
