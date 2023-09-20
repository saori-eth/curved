import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  avatar: string;
  author: string;
  title: string;
  image: string;
  price: number;
}

export function PostCard({ id, avatar, author, title, image, price }: Props) {
  return (
    <Link
      href={`/post/${id}`}
      className="group block w-full select-none space-y-3 rounded-xl border border-neutral-500 bg-neutral-800 p-4 transition hover:cursor-pointer hover:border-neutral-400 hover:bg-neutral-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src={avatar}
            alt={`${author}'s Avatar`}
            width={32}
            height={32}
            draggable={false}
            className="rounded-full"
          />
          <span className="text-sm">{author}</span>
        </div>

        <div className="text-sm text-neutral-400">{price} ETH</div>
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="relative aspect-square w-full rounded-lg bg-neutral-900">
        <Image
          src={image}
          alt={`${title} image`}
          fill
          draggable={false}
          className="rounded-lg"
        />
      </div>
    </Link>
  );
}
