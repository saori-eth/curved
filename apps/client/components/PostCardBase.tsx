import Link from "next/link";

interface Props {
  id: string;
  layer: number;
  disableLink?: boolean;
  children?: React.ReactNode;
}

export function PostCardBase({ id, layer, children, disableLink }: Props) {
  const zIndex = layer * 10;

  return (
    <div
      className={`relative p-3 pb-2.5 ${layer === 1 ? "md:rounded-2xl" : "rounded-2xl"
        } ${disableLink ? "" : "transition hover:bg-slate-700/20"}`}
    >
      <div className="w-full space-y-2">{children}</div>

      {disableLink ? null : (
        <Link
          href={`/post/${id}`}
          className="absolute inset-0 rounded-2xl"
          style={{ zIndex }}
        />
      )}
    </div>
  );
}
