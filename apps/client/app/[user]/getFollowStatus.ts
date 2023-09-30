"use server";

import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";

const GetFollowStatusSchema = z.object({
  address: z.string(),
});

type GetFollowStatusArgs = z.infer<typeof GetFollowStatusSchema>;

export async function getFollowStatus(args: GetFollowStatusArgs) {
  const { address } = GetFollowStatusSchema.parse(args);

  const session = await getSession();
  if (!session) {
    return false;
  }

  return following ? true : false;
}
