"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const DropdownRoot = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

interface DropdownContentProps {
  children: React.ReactNode;
}

export function DropdownContent({ children }: DropdownContentProps) {
  const [mounted, setMounted] = useState(false);

  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`z-20 overflow-hidden rounded-lg bg-slate-700 text-slate-300 shadow-lg transition ${
          mounted ? "" : "scale-75 opacity-0"
        }`}
      >
        {children}
        <Mount setMounted={setMounted} />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

function Mount({
  setMounted,
}: {
  setMounted: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [setMounted]);
  return null;
}

interface DropdownItemProps extends DropdownMenu.MenuItemProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function DropdownItem({
  icon,
  children,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      {...props}
      className={`flex cursor-pointer select-none items-center space-x-1 py-1.5 pl-3.5 pr-4 font-bold transition focus:bg-slate-500/30 focus:outline-none active:opacity-90 ${className}`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </DropdownMenu.Item>
  );
}
