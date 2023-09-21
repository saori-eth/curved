"use server";

import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { pendingContent } from "@/lib/db/schema";

const PublishSchema = z.object({
  description: z.string(),
  url: z.string(),
});

export type PublishData = z.infer<typeof PublishSchema>;

export async function publish(_data: PublishData) {
  const data = PublishSchema.parse(_data);

  const session = await getSession();
  if (!session) {
    return;
  }

  await db.insert(pendingContent).values({
    description: data.description,
    owner: session.user.address,
    url: data.url,
  });
}
