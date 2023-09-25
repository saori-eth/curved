import { NextRequest } from "next/server";

import { resetTable } from "@/lib/db";

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const tableName = url.pathname.split("/").pop();
  await resetTable(tableName as string);
  return new Response(
    JSON.stringify({
      msg: `Table ${tableName} reset`,
    }),
    {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    },
  );
}
