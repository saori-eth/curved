"use server";

import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { post } from "db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { s3, S3_BUCKET } from "@/lib/s3";

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

    // Mark post as deleted
    await db
      .update(post)
      .set({ deleted: true })
      .where(and(eq(post.publicId, id), eq(post.owner, session.user.address)));

    revalidatePath(`/`);
    revalidatePath(`/post/${id}`);
    revalidatePath(`/@${session.user.username}`);

    // If successful, delete from S3
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: `posts/${id}`,
    });

    await s3.send(command);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
