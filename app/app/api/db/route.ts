import { db } from "../../../lib/db/db";

export async function GET() {
  console.log(db);
}
