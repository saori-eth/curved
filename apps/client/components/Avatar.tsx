import BoringAvatar from "boring-avatars";
import Image from "next/image";

interface Props {
  src?: string | null;
  draggable?: boolean;
  loading?: boolean;
  uniqueKey: string;
  size: number;
}

export default function Avatar({
  src,
  draggable = false,
  loading = false,
  uniqueKey,
  size,
}: Props) {
  return (
    <div
      className={`aspect-square rounded-full ${
        loading ? "animate-pulse bg-slate-300" : "bg-slate-200"
      }`}
      style={{ height: size, width: size }}
    >
      {loading ? null : src ? (
        <Image
          src={src}
          priority
          width={size}
          height={size}
          sizes={`${size}px`}
          alt="Avatar"
          draggable={draggable}
          className="rounded-full object-cover"
        />
      ) : (
        <BoringAvatar
          size={size}
          name={uniqueKey}
          variant="pixel"
          colors={BORING_AVATAR_COLORS}
        />
      )}
    </div>
  );
}

export const BORING_AVATAR_COLORS = [
  "#F56565",
  "#ED8936",
  "#ECC94B",
  "#48BB78",
  "#38B2AC",
  "#4299E1",
  "#667EEA",
  "#9F7AEA",
  "#ED64A6",
];
