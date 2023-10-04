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
      className={`relative rounded-2xl p-4 ${disableLink ? "" : "transition hover:bg-slate-700/20"
        }`}
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
