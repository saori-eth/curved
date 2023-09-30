"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { getAvatarUrl } from "@/lib/getAvatarUrl";

const GetTradesSchema = z.object({
  shareId: z.number(),
});

type GetTradesArgs = z.infer<typeof GetTradesSchema>;

export async function getTrades(args: GetTradesArgs) {
  const { shareId } = GetTradesSchema.parse(args);


  return withProfiles;
}
