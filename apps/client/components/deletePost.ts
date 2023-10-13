"use server";

import { post } from "db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

const DeletePostSchema = z.object({
  id: z.string(),
});

type DeletePostArgs = z.infer<typeof DeletePostSchema>;

export async function deletePost(args: DeletePostArgs) {
  try {
    const { id } = DeletePostSchema.parse(args);

    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .update(post)
      .set({ deleted: true })
      .where(and(eq(post.publicId, id), eq(post.owner, session.user.address)));

    revalidatePath(`/post/${id}`);
    revalidatePath(`/@${session.user.username}`);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
