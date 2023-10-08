import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { twitterAuth } from "@/lib/auth/lucia";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [url, codeVerifier, state] = await twitterAuth.getAuthorizationUrl();

  cookies().set({
    httpOnly: true,
    maxAge: 60 * 60,
    name: "twitter-code-verifier",
    value: codeVerifier,
  });

  cookies().set({
    httpOnly: true,
    maxAge: 60 * 60,
    name: "twitter-state",
    value: state,
  });

  return NextResponse.redirect(url);
}
