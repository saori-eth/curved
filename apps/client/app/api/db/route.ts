import { viewTables } from "@/lib/db";

export async function GET() {
  const tables = await viewTables();
  return new Response(JSON.stringify(tables, null, 2), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}
