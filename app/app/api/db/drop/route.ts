import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  await db.execute(sql`
    DROP TABLE IF EXISTS auth_user;
  `);
}
