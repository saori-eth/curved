interface Props {
  title: string;
  value?: string;
  currency: string;
  children?: React.ReactNode;
}

export function Stat({ title, value, currency, children }: Props) {
  const num = Number(value);

  return (
    <div className="relative rounded-xl border-2 border-slate-700 p-4">
      <h3 className="text-slate-400">{title}</h3>

      <p className="space-x-1">
        <span className="text-xl font-semibold leading-snug">
          {value
            ? num > 1000
              ? num.toLocaleString(undefined, { useGrouping: true })
              : value
            : "0.00"}
        </span>
        <span className="text-slate-400">{currency}</span>
      </p>

      {children}
    </div>
  );
}
