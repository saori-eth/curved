import Image from "next/image";
import Link from "next/link";

import { toHex } from "@/lib/toHex";
import { toRelativeDate } from "@/lib/toRelativeDate";

import Avatar from "./Avatar";

interface Props {
  shareId: number;
  url: string;
  owner: string;
  description: string;
  avatar?: string | null;
  username?: string | null;
  createdAt: string;
}

export function PostCard({
  url,
  createdAt,
  avatar,
  username,
  owner,
  shareId,
  description,
}: Props) {
  return (
    <Link
      href={`/post/${toHex(shareId)}`}
      className="group block w-full select-none space-y-3 rounded-xl bg-slate-800 p-4 transition hover:cursor-pointer hover:border-slate-400 hover:bg-slate-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex w-2/3 items-center space-x-2">
          <Avatar src={avatar} uniqueKey={username ?? owner} size={32} />
          <span className="truncate text-sm font-bold">
            {username ? username : owner}
          </span>
        </div>

        <div className="text-sm text-slate-400">
          {toRelativeDate(createdAt)}
        </div>
      </div>

      {url && (
        <Image
          src={url}
          alt="Post image"
          width={0}
          height={0}
          sizes="517px"
          draggable={false}
          className="h-auto max-h-[1000px] w-full rounded-lg object-contain"
        />
      )}

      <h3 className="text-ellipsis text-sm text-slate-400">{description}</h3>
    </Link>
  );
}
