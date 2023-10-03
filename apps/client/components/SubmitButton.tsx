import { forwardRef, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export const SubmitButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        disabled={disabled}
        className={`rounded-full bg-sky-500 px-5 py-1 text-lg font-bold text-white transition ${
          disabled ? "opacity-50" : "hover:bg-sky-600 active:scale-95"
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";
