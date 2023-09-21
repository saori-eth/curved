"use server";

import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";

const PublishSchema = z.object({
  description: z.string(),
  title: z.string(),
  url: z.string(),
});

export type PublishData = z.infer<typeof PublishSchema>;

export async function publish(_data: PublishData) {
  const data = PublishSchema.parse(_data);

  const session = await getSession();
  if (!session) {
    return;
  }

  await db.insert(content).values({
    description: data.description,
    owner: session.user.address,
    pending: true,
    shareId: -1,
    title: data.title,
    url: data.url,
  });
}
