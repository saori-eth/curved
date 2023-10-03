"use server";

import { MAX_USERNAME_LENGTH, user } from "db";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getSession } from "@/lib/auth/getSession";
import { db } from "@/lib/db";

const EditUsernameSchema = z.object({
  value: z
    .string()
    .min(3)
    .max(MAX_USERNAME_LENGTH)
    .refine((value) => {
      return /^[a-z0-9_]+$/i.test(value);
    }),
});

type EditUsernameArgs = z.infer<typeof EditUsernameSchema>;

export async function editUsername(_args: EditUsernameArgs) {
  const parsed = EditUsernameSchema.safeParse(_args);

  if (!parsed.success) {
    return {
      message:
        "Invalid username. Must be a minimum of 3 characters. Only letters, numbers, and underscores are allowed.",
      success: false,
    };
  }

  const args = parsed.data;

  const session = await getSession();
  if (!session) {
    return {
      message: "Not logged in",
      success: false,
    };
  }

  // Check if username is taken
  const existingUser = await db.query.user.findFirst({
    where: (row, { like }) => like(row.username, args.value),
  });

  if (existingUser && existingUser.id !== session.user.userId) {
    return {
      message: "Username is taken",
      success: false,
    };
  }

  // Update username
  await db
    .update(user)
    .set({
      username: args.value,
    })
    .where(eq(user.id, session.user.userId));

  return {
    message: "Username updated",
    success: true,
  };
}
