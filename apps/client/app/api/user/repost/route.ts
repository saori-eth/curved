import { MAX_CAPTION_LENGTH, repost } from "db";
import { NextRequest } from "next/server";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

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
  caption: z.string().max(MAX_CAPTION_LENGTH),
  repostId: z.number().optional(),
  shareId: z.number(),
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

  const { shareId, caption, repostId } = parsed.data;

  try {
    if (repostId) {
      // Verify that the repost exists
      const existingRepost = await db.query.repost.findFirst({
        where: (row, { eq, and }) =>
          and(eq(row.id, repostId), eq(row.referenceShareId, shareId)),
      });

      if (!existingRepost) {
        return new Response("Bad Request", { status: 400 });
      }
    }

    await db.insert(repost).values({
      caption,
      referenceRepostId: repostId,
      referenceShareId: shareId,
      userId: session.user.userId,
    });

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response("Bad Request", { status: 400 });
  }
}
