"use server";

import { pendingPost } from "db";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

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
    .where(eq(pendingPost.owner, session.user.address));
}
