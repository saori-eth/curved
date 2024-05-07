"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { MdSync } from "react-icons/md";

interface IRefreshContext {
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  timeChanged: boolean;
}

export const RefreshContext = createContext<IRefreshContext>({
  setTime: () => {},
  time: Date.now(),
  timeChanged: false,
});

const START = Date.now();

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(START);
  const [timeChanged, setTimeChanged] = useState(false);

  useEffect(() => {
    if (time === START) {
      return;
    }

    setTimeChanged(true);
  }, [time]);

  return (
    <RefreshContext.Provider value={{ setTime, time, timeChanged }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}

export function RefreshButton() {
  const router = useRouter();
  const { setTime } = useRefresh();
  const [pending, startTransition] = useTransition();

  function refresh() {
    if (pending) {
      return;
    }

    setTime(Date.now());

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 120));
      router.refresh();
    });
  }

  return (
    <button
      title="Refresh"
      onClick={refresh}
      className={`absolute right-2 rounded-full p-1 text-slate-400 transition duration-300 ${
        pending
          ? "-rotate-180 text-slate-600"
          : "active:text-white md:hover:text-white md:active:opacity-80 "
      }`}
    >
      <MdSync />
    </button>
  );
}
