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
          className="flex h-full w-full select-none flex-col items-center justify-center rounded-full p-3 opacity-50 transition hover:opacity-100 active:scale-95 md:flex-row md:justify-start md:space-x-1 md:py-2 md:opacity-70 md:hover:bg-slate-700"
        >
          <span className="mt-0.5 text-2xl md:mt-0 md:w-9">{icon}</span>
          <span className="text-sm font-bold md:text-xl">{title}</span>
        </button>
      </li>
    );
  },
);

SidebarButton.displayName = "SidebarButton";
