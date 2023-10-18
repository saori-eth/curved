import { connect } from "@planetscale/database";
import * as schema from "db";
import { drizzle } from "drizzle-orm/planetscale-serverless";

const secureUrl = process.env.DATABASE_URL?.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

export const planetscaleConnection = connect({ url: secureUrl });
export const db = drizzle(planetscaleConnection, { schema });
