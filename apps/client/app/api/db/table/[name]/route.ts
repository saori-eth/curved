import { viewTable } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const tableName = url.pathname.split("/").pop();
  const table = await viewTable(tableName as string);
  return new Response(JSON.stringify(table.rows, null, 2), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}
