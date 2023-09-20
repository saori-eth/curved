import Image from "next/image";

interface Props {
  avatar: string;
  author: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

export function PostCard({
  avatar,
  author,
  title,
  description,
  image,
  price,
}: Props) {
  return (
    <div className="group relative w-full max-w-sm select-none space-y-3 rounded-xl border border-slate-500 bg-slate-800 p-4 transition hover:cursor-pointer hover:border-slate-400 hover:bg-slate-700 hover:shadow-lg">
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

        <div className="text-sm text-slate-400">{price} ETH</div>
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="relative aspect-square w-full rounded-lg bg-slate-900">
        <Image
          src={image}
          alt={`${title} image`}
          fill
          draggable={false}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
