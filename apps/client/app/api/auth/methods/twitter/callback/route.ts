import { user } from "db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { twitterAuth } from "@/lib/auth/lucia";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    console.log("Twitter Callback - No session");
    return new Response("Unauthorized", { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const stateCookie = cookies().get("twitter-state");
  const storedState = stateCookie?.value;

  if (!code || !state || !storedState || state !== storedState) {
    console.log("Twitter Callback - Invalid state");
    return new Response("Unauthorized", { status: 401 });
  }

  const codeVerifierCookie = cookies().get("twitter-code-verifier");
  if (!codeVerifierCookie) {
    console.log("Twitter Callback - No code verifier");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
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

    return NextResponse.redirect(`/@${session.user.username}`);
  } catch (e) {
    console.error(e);
    return new Response("Unauthorized", { status: 401 });
  }
}
