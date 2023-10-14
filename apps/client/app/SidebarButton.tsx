import { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  text: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const SidebarButton = forwardRef<HTMLButtonElement, Props>(
  ({ text, icon, ...props }, ref) => {
    return (
      <li className="w-full">
        <button
          {...props}
          ref={ref}
          draggable={false}
          disabled={props.disabled}
          className={`flex h-full w-full select-none flex-col items-center justify-center rounded-full p-3 transition md:flex-row md:justify-start md:space-x-1 md:py-2 ${
            props.disabled
              ? "text-slate-600"
              : "text-slate-400 active:scale-95 active:text-white md:hover:bg-slate-700 md:hover:text-white"
          }`}
        >
          <span className="mt-0.5 text-2xl md:mt-0 md:w-8">{icon}</span>
          <span className="text-sm font-bold md:text-xl">{text}</span>
          {props.children}
        </button>
      </li>
    );
  },
);

SidebarButton.displayName = "SidebarButton";
