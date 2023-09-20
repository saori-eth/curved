import type { Connection } from "@planetscale/database";
import type { Pool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

const { MODE, DEV_DATABASE_URL, DATABASE_URL } = process.env;

export let planetscaleConnection: Connection;
export let mysql2Connection: Pool;

const dbUrl = MODE === "dev" ? DEV_DATABASE_URL : DATABASE_URL;
const secureUrl = dbUrl?.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

planetscaleConnection = connect({ url: secureUrl });

export const db = drizzle(planetscaleConnection);
