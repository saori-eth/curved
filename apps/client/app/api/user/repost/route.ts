import { nftPost, post, repost } from "db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";
import { sendNotification } from "@/lib/push/webpush";

import { RepostArgs, RepostResponse } from "./types";

/*
  try {
    await fetch(`/api/user/repost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shareId, repostId, quote }),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
*/

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const json = await request.json();
  const parsed = RepostArgs.safeParse(json);
  if (!parsed.success) {
    return new Response("Bad Request", { status: 400 });
  }

  const { postId, caption } = parsed.data;

  try {
    const newPostId = nanoidLowercase();

    let owner;
    await db.transaction(async (tx) => {
      const data = await tx
        .select({
          nftShareId: nftPost.shareId,
          owner: post.owner,
          repostShareId: repost.referenceShareId,
          type: post.type,
        })
        .from(post)
        .where(eq(post.publicId, postId))
        .limit(1)
        .leftJoin(
          nftPost,
          and(eq(post.type, "post"), eq(post.publicId, nftPost.postId)),
        )
        .leftJoin(
          repost,
          and(eq(post.type, "repost"), eq(post.publicId, repost.postId)),
        );

      owner = data[0]?.owner;

      const shareId = data[0]?.nftShareId ?? data[0]?.repostShareId;

      if (shareId == null || shareId == undefined) {
        throw new Error("No shareId found");
      }

      const type = data[0]?.type;
      if (!type) {
        throw new Error("No type found");
      }

      await tx.insert(post).values({
        owner: session.user.address.toLowerCase(),
        publicId: newPostId,
        type: "repost",
      });

      await tx.insert(repost).values({
        caption,
        postId: newPostId,
        referencePostId: postId,
        referenceShareId: shareId,
      });
    });

    revalidatePath(`/post/${postId}`);
    revalidatePath(`/post/${newPostId}`);
    revalidatePath(`/@${session.user.username}`);
    revalidatePath("/(feed)", "page");

    // send notification to post owner
    // send notification to repost owner

    if (owner) {
      sendNotification(owner, {
        body: `${session.user.username} reposted your post`,
        icon: "/images/android-chrome-192x192.png",
        title: "New Repost",
        url: `/post/${newPostId}`,
      });
    }

    const respose: RepostResponse = {
      postId: newPostId,
    };

    return NextResponse.json(respose);
  } catch (e) {
    console.log(e);
    return new Response("Bad Request", { status: 400 });
  }
}
