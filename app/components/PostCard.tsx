import Image from "next/image";

interface Props {
  avatar: string;
  author: string;
  title: string;
  description: string;
  image: string;
  buttons: string[];
}

export function PostCard({
  avatar,
  author,
  title,
  description,
  image,
  buttons,
}: Props) {
  return (
    <div className="relative my-4 w-96 rounded-lg border border-gray-300 bg-slate-700 p-4">
      <div className="absolute left-0 top-0 flex select-none items-center space-x-2 p-3 pl-4">
        <Image
          src={avatar}
          alt={`${author}'s Avatar`}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-sm text-white">{author}</span>
      </div>

      <h2 className="mt-8 text-center text-xl text-white">{title}</h2>

      <p className="my-4 text-center text-white">{description}</p>

      <Image
        src={image}
        alt={`${title} image`}
        width={640}
        height={480}
        className="h-auto w-full rounded-lg"
      />

      <div className="mt-4 flex select-none items-center justify-center space-x-12">
        {buttons.map((btn) => (
          <button
            key={btn}
            className="w-full rounded border border-white bg-white/10 py-2 text-white hover:bg-white/20"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
