import { MAX_CAPTION_LENGTH, post, repost } from "db";
import { NextRequest } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { nanoidLowercase } from "@/lib/db/nanoid";

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

const RepostArgs = z.object({
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
  publicId: z.string(),
});

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

  const { publicId, caption } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      const newPostId = nanoidLowercase();

      await tx.insert(post).values({
        owner: session.user.address,
        publicId: newPostId,
        type: "repost",
      });

      await tx.insert(repost).values({
        caption,
        postId: newPostId,
        referencePostId: publicId,
      });
    });

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response("Bad Request", { status: 400 });
  }
}
