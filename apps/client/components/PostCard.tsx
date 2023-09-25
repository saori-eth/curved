import Image from "next/image";
import Link from "next/link";

import Avatar from "./Avatar";

interface Props {
  shareId: number;
  url: string;
  owner: string;
  description: string;
  avatar?: string | null;
  username?: string | null;
}

export function PostCard({
  url,
  avatar,
  username,
  owner,
  shareId,
  description,
}: Props) {
  return (
    <Link
      href={`/post/${shareId}`}
      className="group block w-full select-none space-y-3 rounded-xl border border-slate-500 bg-slate-800 p-4 transition hover:cursor-pointer hover:border-slate-400 hover:bg-slate-700 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex w-2/3 items-center space-x-2">
          <Avatar src={avatar} uniqueKey={username ?? owner} size={32} />
          <span className="truncate text-sm text-slate-400">
            {username ? `@${username}` : owner}
          </span>
        </div>

        <div className="text-sm text-slate-400">#{shareId}</div>
      </div>

      <div className="relative aspect-square w-full rounded-lg bg-slate-900">
        {url && (
          <Image
            src={url}
            alt="Post image"
            fill
            sizes="394px"
            draggable={false}
            className="rounded-lg object-cover"
          />
        )}
      </div>

      <h3 className="text-ellipsis text-sm">{description}</h3>
    </Link>
  );
}
