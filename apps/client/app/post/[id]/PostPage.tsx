import Image from "next/image";

import Avatar from "@/components/Avatar";
import { Post } from "@/lib/fetchPost";
import { fetchProfile } from "@/lib/fetchProfile";

interface Props {
  post: Post;
}

export async function PostPage({ post }: Props) {
  const profile = await fetchProfile(post.owner);

  const buyPrice = "0.0156";
  const sellPrice = "0.0122";

  return (
    <div className="grid h-full grid-cols-5 gap-8">
      <div className="col-span-2 space-y-4">
        <div className="relative aspect-square rounded-lg">
          <Image
            src={post.url}
            alt="Post image"
            fill
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

          <span className="text-sm text-neutral-400">
            {profile ? `@${profile.username}` : post.owner}
          </span>
        </div>

        <div>{post.description}</div>
      </div>

      <div className="col-span-3 space-y-4">
        <ul className="w-full space-y-1">
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
          <li className="w-full rounded-md bg-neutral-900 px-4 py-1">Trade</li>
        </ul>

        <div className="flex w-full space-x-4">
          <div className="w-full space-y-1">
            <button className="w-full rounded-md border border-green-700 bg-green-800 py-2 transition hover:border-green-500 hover:bg-green-700 active:opacity-90">
              Buy
            </button>
            <div className="text-center text-sm text-neutral-400">
              {buyPrice} ETH
            </div>
          </div>

          <div className="w-full space-y-1">
            <button className="w-full rounded-md border border-red-700 bg-red-900 py-2 transition hover:border-red-600 hover:bg-red-800 active:opacity-90">
              Sell
            </button>
            <div className="text-center text-sm text-neutral-400">
              {sellPrice} ETH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
