import Image from "next/image";
import Link from "next/link";

import { fetchProfile } from "@/lib/fetchProfile";

import Avatar from "./Avatar";

interface Props {
  shareId: number;
  url: string;
  owner: string;
  description: string;
}

export async function PostCard({ url, owner, shareId, description }: Props) {
  const profile = await fetchProfile(owner);

  const price = "0.0156";

  return (
    <Link
      href={`/post/${shareId}`}
      className="group block w-full select-none space-y-3 rounded-xl border border-neutral-500 bg-neutral-800 p-4 transition hover:cursor-pointer hover:border-neutral-400 hover:bg-neutral-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar
            src={profile?.avatar}
            uniqueKey={profile?.username ?? owner}
            size={32}
          />
          <span className="text-sm text-neutral-400">
            {profile ? `@${profile.username}` : owner}
          </span>
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
