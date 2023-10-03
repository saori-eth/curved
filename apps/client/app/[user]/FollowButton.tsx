import { follow } from "db";
import { and, eq, like } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

interface Props {
  address: string;
  username: string;
}

export async function FollowButton({ address, username }: Props) {
  const session = await getSession();

  if (session && session.user.address === address) {
    return null;
  }

  let isFollowing = false;

  if (session) {
    const foundFollowing = await db.query.follow.findFirst({
      where: (row, { and, like, eq }) =>
        and(
          and(
            eq(row.userId, session.user.userId),
            like(row.following, address),
          ),
        ),
    });

    if (foundFollowing) {
      isFollowing = true;
    }
  }

  async function toggleFollow() {
    "use server";

    const session = await getSession();
    if (!session) return;

    try {
      if (isFollowing) {
        await db
          .delete(follow)
          .where(
            and(
              eq(follow.userId, session.user.userId),
              like(follow.following, address),
            ),
          );
      } else {
        await db.insert(follow).values({
          following: address,
          userId: session.user.userId,
        });
      }
    } catch (e) {
      console.error(e);
    }

    redirect(`/@${username}`);
  }

  const disabled = !session;

  return (
    <form action={toggleFollow}>
      <button
        type="submit"
        disabled={disabled}
        className={`group w-24 rounded-full border py-1 ${
          isFollowing
            ? "border-slate-400"
            : "border-transparent bg-white text-slate-900"
        } ${
          disabled
            ? "opacity-50"
            : isFollowing
            ? "hover:border-red-400 hover:bg-red-950/30 hover:text-red-400 active:bg-red-950/60"
            : "transition hover:text-slate-900 hover:opacity-90 active:scale-95"
        }`}
      >
        {isFollowing ? (
          disabled ? (
            <span>Following</span>
          ) : (
            <>
              <span className="group-hover:hidden">Following</span>
              <span className="hidden group-hover:block">Unfollow</span>
            </>
          )
        ) : (
          <span>Follow</span>
        )}
      </button>
    </form>
  );
}
