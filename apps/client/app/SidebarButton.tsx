interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
}

export function SidebarButton({ title, icon, ...rest }: Props) {
  return (
    <li className="w-full">
      <button
        {...rest}
        draggable={false}
        className="flex h-full w-full select-none justify-center space-x-2 rounded-xl px-4 py-2 text-xl font-bold transition hover:bg-slate-700 active:scale-95 md:justify-start"
      >
        <span>{icon}</span>
        <span className="hidden md:block">{title}</span>
      </button>
    </li>
  );
}
