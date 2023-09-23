"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { pendingContent } from "@/lib/db/schema";

const EditPendingSchema = z.object({
  description: z.string(),
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
    .update(pendingContent)
    .set({
      description: args.description,
    })
    .where(eq(pendingContent.owner, session.user.address));
}
