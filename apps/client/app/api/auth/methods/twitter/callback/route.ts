import { user } from "db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { twitterAuth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";

import {
  TWITTER_CODE_VERIFIER_COOKIE,
  TWITTER_STATE_COOKIE,
} from "../constants";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const stateCookie = cookies().get(TWITTER_STATE_COOKIE);
    const codeVerifierCookie = cookies().get(TWITTER_CODE_VERIFIER_COOKIE);

    const storedState = stateCookie?.value;

    if (
      !code ||
      !state ||
      !codeVerifierCookie ||
      !storedState ||
      state !== storedState
    ) {
      console.log("Invalid state", { state, storedState });
      throw new Error("Invalid state");
    }

    const twitter = await twitterAuth.validateCallback(
      code,
      codeVerifierCookie.value,
    );

    console.log("Twitter user", twitter.twitterUser);

    await db
      .update(user)
      .set({
        twitterUsername: twitter.twitterUser.username,
      })
      .where(eq(user.id, session.user.userId));
  } catch (e) {
    console.error(e);
  }

  return NextResponse.redirect(`/@${session.user.username}`);
}
