"use client";

interface Props {
  children: React.ReactNode;
}

export function Dialog({ children }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="max-w-content mx-2 my-auto h-2/3 w-full rounded-2xl bg-slate-800 p-8 shadow-xl"
    >
      {children}
    </div>
  );
}
