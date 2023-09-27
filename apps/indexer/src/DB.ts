import { connect } from "@planetscale/database";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "./schema";

const secureUrl = process.env.DATABASE_URL?.replace(
  "?sslaccept=strict",
  `?ssl={"rejectUnauthorized":true}`,
);

export const planetscaleConnection = connect({ url: secureUrl });
export const db = drizzle(planetscaleConnection, { schema });

export const viewTables = async () => {
  const tables = await db.execute(sql`
    SHOW TABLES;
  `);
  const names = tables.rows.map((row: any) => row.Tables_in_curved);
  return names;
};

export const viewTable = async (tableName: string) => {
  const table = await db.execute(sql`
    SELECT *
    FROM ${sql.identifier(tableName)}
    ORDER BY id;
  `);
  return table;
};

export const dropTable = async (tableName: string) => {
  await db.execute(sql`
    DROP TABLE ${sql.identifier(tableName)};
  `);
  const tables = await viewTables();
  console.log("drop table", tableName);
  console.log("new tables", tables);
};

export const resetTable = async (tableName: string) => {
  await db.execute(sql`
    TRUNCATE TABLE ${sql.identifier(tableName)};
  `);
  const table = await viewTable(tableName);
  console.log("reset table", table);
  console.log("new content", table);
};
