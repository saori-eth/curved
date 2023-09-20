import { relations } from "drizzle-orm";
import {
  bigint,
  char,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const content = mysqlTable(
  "content",
  {
    createdAt: timestamp("created_at").defaultNow(),
    description: varchar("description", { length: 1000 }),
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: 12 }).notNull(),
    shareId: bigint("share_id", { mode: "number" }).notNull(),
    title: varchar("title", { length: 50 }),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    url: varchar("url", { length: 1000 }).notNull(),
  },
  (table) => ({
    shareIdIndex: uniqueIndex("shareId").on(table.shareId),
  }),
);

export const trades = mysqlTable(
  "trades",
  {
    amount: bigint("amount", { mode: "number" }).notNull(),
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: 12 }).notNull(),
    price: varchar("price", { length: 255 }).notNull(),
    shareId: bigint("share_id", { mode: "number" }).notNull(),
    side: bigint("side", { mode: "number" }).notNull(),
    supply: bigint("supply", { mode: "number" }).notNull(),
    trader: varchar("trader", { length: 12 }).notNull(),
  },
  (table) => ({
    shareIdIndex: uniqueIndex("shareId").on(table.shareId),
  }),
);

export const users = mysqlTable(
  "users",
  {
    address: varchar("address", { length: 255 }).notNull(),
    avatar: varchar("avatar", { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    id: serial("id").primaryKey(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    username: varchar("username", { length: 255 }).notNull(),
  },
  (table) => ({
    addressIndex: uniqueIndex("address").on(table.address),
  }),
);
