import Image from "next/image";
import Link from "next/link";
import { BiCollection, BiRepost } from "react-icons/bi";

import Avatar from "./Avatar";

interface Props {
  shareId: number;
  url: string;
  owner: string;
  caption: string;
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
  caption,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex select-none items-center justify-between">
        <div className="w-2/3">
          {username ? (
            <Link
              href={`/@${username}`}
              className="flex w-fit items-center space-x-2 pr-2"
            >
              <Avatar src={avatar} uniqueKey={username} size={32} />
              <span className="text-sm font-bold">{username}</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Avatar src={avatar} uniqueKey={owner} size={32} />
              <span className="truncate text-sm font-bold">{owner}</span>
            </div>
          )}
        </div>

        <div className="text-sm text-slate-400"></div>
      </div>

      {url && (
        <Image
          src={url}
          alt="Post image"
          width={0}
          height={0}
          sizes="517px"
          draggable={false}
          priority
          className="h-auto max-h-[1000px] w-full rounded-lg object-contain"
        />
      )}

      <h3 className="text-sm text-slate-400">{caption}</h3>

      <div className="flex items-center justify-between">
        <div className="w-full"></div>

        <div className="flex items-center justify-end space-x-1">
          <button
            title="Repost"
            className="flex aspect-square h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700 hover:text-white active:opacity-80"
          >
            <BiRepost className="text-xl" />
          </button>

          <button
            title="View Reposts"
            className="flex aspect-square h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700 hover:text-white active:opacity-80"
          >
            <BiCollection className="text-xl" />
          </button>

          <button className="h-7 space-x-1 rounded-full border border-slate-500 px-3 transition hover:border-slate-400 hover:bg-slate-700 active:opacity-80">
            <span>8</span>
            <span className="text-slate-400">Shares</span>
          </button>
        </div>
      </div>
    </div>
  );
}
