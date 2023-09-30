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
    <div className="h-full space-y-8 overflow-y-auto">
      <div className="flex space-x-4">
        <div className="w-full">
          <Image
            src={post.url}
            alt="Post image"
            width={0}
            height={0}
            sizes="468px"
            draggable={false}
            className="h-auto max-h-[500px] w-full rounded-lg object-contain"
          />
        </div>

        <div className="w-full space-y-2">
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

                <span className="text-sm font-bold">{post.owner.username}</span>
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

          <p className="text-sm text-slate-400">{post.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Trades shareId={post.shareId} />
        <TradeButtons shareId={post.shareId} />
      </div>
    </div>
  );
}
