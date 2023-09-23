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
      className="my-auto h-2/3 w-full max-w-5xl rounded-2xl bg-neutral-800 p-8 shadow-xl"
    >
      {children}
    </div>
  );
}
