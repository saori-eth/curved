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
              ? "opacity-30"
              : "mactive:scale-95 d:opacity-70 opacity-50 hover:opacity-100 md:hover:bg-slate-700"
          }`}
        >
          <span className="mt-0.5 text-2xl md:mt-0 md:w-9">{icon}</span>
          <span className="text-sm font-bold md:text-xl">{text}</span>
          {props.children}
        </button>
      </li>
    );
  },
);

SidebarButton.displayName = "SidebarButton";
