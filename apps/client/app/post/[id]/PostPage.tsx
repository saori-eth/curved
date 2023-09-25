import Image from "next/image";

import Avatar from "@/components/Avatar";
import { Post } from "@/lib/fetchPost";
import { fetchProfileFromAddress } from "@/lib/fetchProfile";

interface Props {
  post: Post;
}

export async function PostPage({ post }: Props) {
  const profile = await fetchProfileFromAddress(post.owner);

  const buyPrice = "0.0156";
  const sellPrice = "0.0122";

  const hasShares = true;

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
            className="rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Avatar
            size={32}
            uniqueKey={profile?.username ?? post.owner}
            src={profile?.avatar}
          />

          <span className="text-sm text-slate-400">
            {profile ? `@${profile.username}` : post.owner}
          </span>
        </div>

        <div>{post.description}</div>
      </div>

      <div className="col-span-3 space-y-4">
        <ul className="w-full space-y-1">
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-slate-900 px-4 py-1">Trade</li>
        </ul>

        <div className="flex w-full space-x-4">
          <div className="w-full space-y-1">
            <button className="w-full rounded-md bg-green-700 py-2 transition hover:bg-green-600 active:opacity-90">
              Buy
            </button>
            <div className="text-center text-sm text-slate-400">
              {buyPrice} ETH
            </div>
          </div>

          {hasShares && (
            <div className="w-full space-y-1">
              <button className="w-full rounded-md bg-red-800 py-2 transition hover:bg-red-700 active:opacity-90">
                Sell
              </button>
              <div className="text-center text-sm text-slate-400">
                {sellPrice} ETH
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
