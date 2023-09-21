import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/lucia";
import { db } from "@/lib/db/";
import { users } from "@/lib/db/schema";

import { UpdateUserSchema } from "./types";

/**
 * Get user's profile
 */
export async function GET(request: NextRequest) {
  const authRequest = auth.handleRequest({ cookies, request });
  const session = await authRequest.validate();
  if (!session) return new Response(null, { status: 401 });

  const found = await db.query.users.findFirst({
    where: eq(users.address, session.user.address),
  });
  if (!found) return new Response(null, { status: 404 });

  const json: any = {
    avatar: found.avatar ?? undefined,
    username: found.username ?? undefined,
  };

  return NextResponse.json(json);
}

/**
 * Update profile
 */
export async function PATCH(request: NextRequest) {
  const parsed = UpdateUserSchema.safeParse(await request.json());
  if (!parsed.success)
    return new Response(JSON.stringify(parsed.error), { status: 400 });

  const authRequest = auth.handleRequest({ cookies, request });
  const session = await authRequest.validate();
  if (!session) return new Response(null, { status: 401 });

  const { username, avatar } = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        address: session.user.address,
        avatar,
      })
      .onDuplicateKeyUpdate({
        set: {
          avatar,
        },
      });

    if (username) {
      await tx
        .update(users)
        .set({ username })
        .where(eq(users.id, session.user.userId));
    }
  });

  return new Response(null, { status: 200 });
}
