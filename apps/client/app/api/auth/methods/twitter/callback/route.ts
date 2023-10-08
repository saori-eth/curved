import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { twitterAuth } from "@/lib/auth/lucia";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const stateCookie = cookies().get("twitter-state");
  const storedState = stateCookie?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response("Unauthorized", { status: 401 });
  }

  const codeVerifierCookie = cookies().get("twitter-code-verifier");
  if (!codeVerifierCookie) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const twitter = await twitterAuth.validateCallback(
      code,
      codeVerifierCookie.value,
    );

    console.log("Twitter user", twitter.twitterUser);
  } catch (e) {
    console.error(e);
    return new Response("Unauthorized", { status: 401 });
  }
}
