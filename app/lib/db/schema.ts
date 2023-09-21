import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
  char,
} from "drizzle-orm/mysql-core";

import { ETH_AUTH_ID_LENGTH, ETH_AUTH_NONCE_LENGTH } from "./constants";

export const content = mysqlTable(
  "content",
  {
    id: serial("id").primaryKey(),
    description: varchar("description", { length: 1000 }),
    owner: varchar("owner", { length: 12 }).notNull(),
    shareId: bigint("share_id", { mode: "number" }).notNull(),
    title: varchar("title", { length: 50 }),
    url: varchar("url", { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    shareIdIndex: uniqueIndex("shareId").on(table.shareId),
  }),
);

export const trades = mysqlTable(
  "trades",
  {
    id: serial("id").primaryKey(),
    amount: bigint("amount", { mode: "number" }).notNull(),
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
    id: serial("id").primaryKey(),
    address: varchar("address", { length: 255 }).notNull(),
    avatar: varchar("avatar", { length: 1000 }),
    username: varchar("username", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    addressIndex: uniqueIndex("address").on(table.address),
  }),
);

export const ethereumSession = mysqlTable(
  "auth_ethereum_session",
  {
    id: serial("id").primaryKey(),
    nonce: char("nonce", { length: ETH_AUTH_NONCE_LENGTH }).notNull(),
    publicId: char("public_id", { length: ETH_AUTH_ID_LENGTH }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (table) => ({
    publicIdIndex: uniqueIndex("publicId").on(table.publicId),
  }),
);

export const key = mysqlTable("auth_key", {
  id: varchar("id", { length: 255 }).primaryKey(),
  hashedPassword: varchar("hashed_password", { length: 255 }),
  userId: varchar("user_id", { length: 15 }).notNull(),
});

export const session = mysqlTable("auth_session", {
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  id: varchar("id", { length: 128 }).primaryKey(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
  userId: varchar("user_id", { length: 15 }).notNull(),
});

export const user = mysqlTable(
  "auth_user",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    address: char("address", { length: 42 }).notNull(),
  },
  (table) => ({
    addressIndex: uniqueIndex("address").on(table.address),
  }),
);
