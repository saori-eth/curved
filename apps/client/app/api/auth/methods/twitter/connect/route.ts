import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { twitterAuth } from "@/lib/auth/lucia";

import {
  TWITTER_CODE_VERIFIER_COOKIE,
  TWITTER_STATE_COOKIE,
} from "../constants";

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
    name: TWITTER_CODE_VERIFIER_COOKIE,
    path: "/",
    value: codeVerifier,
  });

  cookies().set({
    httpOnly: true,
    maxAge: 60 * 60,
    name: TWITTER_STATE_COOKIE,
    path: "/",
    value: state,
  });

  return NextResponse.redirect(url);
}
