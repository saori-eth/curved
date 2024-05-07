"use server";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

export async function getPublishedId() {
  const session = await getSession();
  if (!session) {
    return;
  }

  try {
    const shareId = await db.transaction(async (tx) => {
      const pending = await tx.query.pendingPost.findFirst({
        where: (row, { eq }) => eq(row.owner, session.user.address),
      });
      if (pending) {
        throw new Error("You have a pending post");
      }

      const post = await tx.query.post.findFirst({
        columns: {
          publicId: true,
        },
        orderBy: (row, { desc }) => [desc(row.createdAt)],
        where: (row, { eq, and }) =>
          and(eq(row.owner, session.user.address), eq(row.type, "post")),
      });
      if (!post) {
        throw new Error("You have no posts");
      }

      return post.publicId;
    });

    return shareId;
  } catch (e) {
    console.warn(e);
    return;
  }
}
