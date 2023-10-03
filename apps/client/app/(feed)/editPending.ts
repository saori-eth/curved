"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { pendingPost } from "@/lib/db/schema";

const EditPendingSchema = z.object({
  caption: z.string(),
});

type EditPendingArgs = z.infer<typeof EditPendingSchema>;

export async function editPending(_args: EditPendingArgs) {
  const args = EditPendingSchema.parse(_args);

  const session = await getSession();
  if (!session) {
    console.error("No session");
    return;
  }

  await db
    .update(pendingPost)
    .set({
      caption: args.caption,
    })
    .where(eq(pendingPost.userId, session.user.userId));
}
