import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { env } from "@/lib/env.mjs";

/**
 * @example /api/revalidate?secret=<token>&path=/api/feed
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  if (secret !== env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!path) {
    return Response.json({ message: "Missing path param" }, { status: 400 });
  }

  console.log("Revalidating path", path);
  revalidatePath(path);

  return Response.json({ now: Date.now(), revalidated: true });
}
