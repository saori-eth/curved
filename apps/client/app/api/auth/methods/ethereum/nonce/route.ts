import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { generateNonce } from "siwe";

import { ETH_SESSION_COOKIE } from "@/lib/auth/ethereum";
import { db } from "@/lib/db";
import { ethereumSession } from "@/lib/db/schema";

import { GetNonceResponse } from "./types";

export const dynamic = "force-dynamic";

/**
 * Generate a new nonce for the user to sign.
 * Uses an "ethereum session id" to keep track of the nonce.
 * Not sure of a better way to do this.
 */
export async function GET(request: NextRequest) {
  // Generate nonce
  const nonce = generateNonce();

  // Get ethereum session id from cookie
  const ethSessionCookie = request.cookies.get(ETH_SESSION_COOKIE);
  const publicId = ethSessionCookie?.value ?? nanoid();

  try {
    await db
      .insert(ethereumSession)
      .values({ nonce, publicId })
      .onDuplicateKeyUpdate({
        set: {
          nonce,
        },
      });

    const json: GetNonceResponse = { nonce };

    return NextResponse.json(json, {
      headers: {
        // Store ethereum session id in cookie
        "Set-Cookie": `${ETH_SESSION_COOKIE}=${publicId}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
