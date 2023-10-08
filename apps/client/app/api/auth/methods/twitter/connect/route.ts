import { createOAuth2AuthorizationUrlWithPKCE } from "@lucia-auth/oauth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/getSession";
import { env } from "@/lib/env.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [url, codeVerifier, state] = await createOAuth2AuthorizationUrlWithPKCE(
    "https://twitter.com/i/oauth2/authorize",
    {
      clientId: env.TWITTER_CLIENT_ID,
      codeChallengeMethod: "S256",
      redirectUri: `${env.DEPLOYED_URL}/api/auth/methods/twitter/callback`,
      scope: ["users.read"],
    },
  );

  cookies().set({
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    name: "twitter-code-verifier",
    value: codeVerifier,
  });

  cookies().set({
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    name: "twitter-state",
    value: state,
  });

  return NextResponse.redirect(url);
}
