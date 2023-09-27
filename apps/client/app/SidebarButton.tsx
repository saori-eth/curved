import { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
}

export const SidebarButton = forwardRef<HTMLButtonElement, Props>(
  ({ title, icon, ...rest }, ref) => {
    return (
      <li className="w-full">
        <button
          {...rest}
          ref={ref}
          draggable={false}
          className="flex h-full w-full select-none justify-center rounded-xl px-4 py-2 text-xl font-bold transition hover:bg-slate-700 active:scale-95 md:justify-start"
        >
          <span className="md:w-9">{icon}</span>
          <span className="hidden md:block">{title}</span>
        </button>
      </li>
    );
  },
);

SidebarButton.displayName = "SidebarButton";
