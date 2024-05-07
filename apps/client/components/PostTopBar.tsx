import Link from "next/link";

import { toRelativeDate } from "@/lib/toRelativeDate";
import { Post } from "@/src/types/post";

import Avatar from "./Avatar";

interface Props {
  children?: React.ReactNode;
  owner: Post["owner"];
  createdAt?: string;
  disableLink?: boolean;
}

export function PostTopBar({ createdAt, children, owner, disableLink }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex h-7 items-center space-x-2">
        {owner.username ? (
          disableLink ? (
            <>
              <Avatar src={owner.avatar} uniqueKey={owner.username} size={32} />
              <span className="text-sm font-bold">{owner.username}</span>
            </>
          ) : (
            <Link
              href={`/@${owner.username}`}
              className="z-40 flex h-7 w-fit items-center space-x-2 hover:underline"
            >
              <Avatar src={owner.avatar} uniqueKey={owner.username} size={32} />
              <span className="text-sm font-bold">{owner.username}</span>
            </Link>
          )
        ) : (
          <>
            <Avatar src={owner.avatar} uniqueKey={owner.address} size={32} />
            <span className="truncate text-sm font-bold">{owner.address}</span>
          </>
        )}

        {children}
      </div>

      {createdAt ? (
        <p className="text-sm text-slate-500">{toRelativeDate(createdAt)}</p>
      ) : null}
    </div>
  );
}
