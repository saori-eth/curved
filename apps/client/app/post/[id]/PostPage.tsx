import Image from "next/image";
import Link from "next/link";

import Avatar from "@/components/Avatar";
import { Post } from "@/lib/fetchPost";

import { TradeButtons } from "./TradeButtons";
import { Trades } from "./Trades";

interface Props {
  post: Post;
}

export function PostPage({ post }: Props) {
  return (
    <div className="h-full space-y-4 overflow-y-auto md:grid md:grid-cols-5 md:gap-8 md:space-y-0">
      <div className="space-y-4 md:col-span-2">
        <div className="relative aspect-square rounded-lg bg-slate-900">
          <Image
            src={post.url}
            alt="Post image"
            fill
            sizes="410px"
            draggable={false}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="w-fit">
          {post.owner.username ? (
            <Link
              href={`/@${post.owner.username}`}
              className="flex items-center space-x-2"
            >
              <Avatar
                size={32}
                uniqueKey={post.owner.username}
                src={post.owner.avatar}
              />

              <span className="text-sm text-slate-400">
                @{post.owner.username}
              </span>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Avatar
                size={32}
                uniqueKey={post.owner.address}
                src={post.owner.avatar}
              />

              <span className="text-sm text-slate-400">
                {post.owner.address}
              </span>
            </div>
          )}
        </div>

        <div>{post.description}</div>
      </div>

      <div className="col-span-3 space-y-4">
        <Trades shareId={post.shareId} />
        <TradeButtons shareId={post.shareId} />
      </div>
    </div>
  );
}
