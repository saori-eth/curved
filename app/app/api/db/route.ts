import { db } from "../../../lib/db";

export async function GET() {
  console.log(db);
}
