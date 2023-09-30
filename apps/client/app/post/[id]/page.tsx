import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Avatar from "@/components/Avatar";
import { fetchPost } from "@/lib/fetchPost";

import { TradeButtons } from "./TradeButtons";
import { Trades } from "./Trades";

export const revalidate = 30;

interface Props {
  params: {
    id: string;
  };
}

export default async function Post({ params }: Props) {
  const shareId = parseInt(params.id);

  const post = await fetchPost(shareId);
  if (!post) notFound();

  return (
    <div className="space-y-2 px-2 md:px-0 md:pt-14">
      {post.owner.username ? (
        <Link
          href={`/@${post.owner.username}`}
          className="flex w-fit items-center space-x-2 pr-2 hover:underline"
        >
          <Avatar
            src={post.owner.avatar}
            uniqueKey={post.owner.username}
            size={32}
          />
          <span className="text-sm font-bold">{post.owner.username}</span>
        </Link>
      ) : (
        <div className="flex items-center space-x-2">
          <Avatar
            src={post.owner.avatar}
            uniqueKey={post.owner.address}
            size={32}
          />
          <span className="truncate text-sm font-bold">
            {post.owner.address}
          </span>
        </div>
      )}

      {post.url ? (
        <Image
          src={post.url}
          alt="Post image"
          width={0}
          height={0}
          sizes="517px"
          draggable={false}
          priority
          className="h-auto max-h-[1000px] w-full rounded-lg object-contain"
        />
      ) : null}

      <h3 className="text-sm text-slate-400">{post.description}</h3>

      <div className="space-y-2 py-4">
        <TradeButtons shareId={shareId} />
        <Trades shareId={shareId} />
      </div>
    </div>
  );
}
