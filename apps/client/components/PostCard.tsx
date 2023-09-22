import Image from "next/image";
import Link from "next/link";

interface Props {
  shareId: number;
  url: string;
  description: string;
}

export function PostCard({ url, shareId, description }: Props) {
  const avatar = "";
  const author = "Saori";
  const price = "0.0156";

  return (
    <Link
      href={`/post/${shareId}`}
      className="group block w-full select-none space-y-3 rounded-xl border border-neutral-500 bg-neutral-800 p-4 transition hover:cursor-pointer hover:border-neutral-400 hover:bg-neutral-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {avatar && (
            <Image
              src={avatar}
              alt={`${author}'s Avatar`}
              width={32}
              height={32}
              draggable={false}
              className="rounded-full"
            />
          )}
          <span className="text-sm">{author}</span>
        </div>

        <div className="text-sm text-neutral-400">{price} ETH</div>
      </div>

      <div className="relative aspect-square w-full rounded-lg bg-neutral-900">
        {url && (
          <Image
            src={url}
            alt="Post image"
            fill
            draggable={false}
            className="rounded-lg"
          />
        )}
      </div>

      <h3 className="text-ellipsis text-sm">{description}</h3>
    </Link>
  );
}
