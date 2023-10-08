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
          className="flex h-full w-full select-none items-center justify-center space-x-1 rounded-xl px-4 py-2 opacity-30 transition hover:opacity-100 active:scale-95 md:justify-start md:opacity-100 md:hover:bg-slate-700"
        >
          <span className="text-2xl md:w-9">{icon}</span>
          <span className="hidden text-xl font-bold md:block">{title}</span>
        </button>
      </li>
    );
  },
);

SidebarButton.displayName = "SidebarButton";
