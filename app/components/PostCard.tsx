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
    <div
      className="border border-gray-300 p-4 my-4 relative rounded-lg backdrop-blur-sm bg-opacity-20 w-96"
      style={{ backgroundColor: "#2A3A4C" }}
    >
      <div className="absolute top-0 left-0 flex items-center space-x-2 p-3 pl-4 select-none">
        <Image
          src={avatar}
          alt={`${author}'s Avatar`}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-sm text-white">{author}</span>
      </div>
      <h2 className="text-xl mt-8 text-center text-white">{title}</h2>
      <p className="my-4 text-center text-white">{description}</p>
      <Image
        src={image}
        alt={`${title} image`}
        width={640}
        height={480}
        className="w-full h-auto rounded-lg"
      />
      <div className="flex justify-center space-x-12 items-center mt-4 select-none">
        {buttons.map((btn) => (
          <button
            key={btn}
            className="text-white py-2 px-4 rounded w-32 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-80"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
