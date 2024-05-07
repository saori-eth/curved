import { forwardRef, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
}

export const SubmitButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`rounded-full bg-sky-600 px-5 py-1 text-lg font-bold text-white transition ${
          disabled ? "opacity-50" : "hover:bg-sky-500 active:scale-95"
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";
