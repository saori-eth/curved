import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
  char,
} from "drizzle-orm/mysql-core";

import {
  AUTH_KEY_TABLE_NAME,
  AUTH_SESSION_TABLE_NAME,
  AUTH_USER_TABLE_NAME,
  ETH_ADDRESS_LENGTH,
  ETH_AUTH_ID_LENGTH,
  ETH_AUTH_NONCE_LENGTH,
  MAX_USERNAME_LENGTH,
  USER_ID_LENGTH,
} from "./constants";

export const content = mysqlTable(
  "content",
  {
    id: serial("id").primaryKey(),
    description: varchar("description", { length: 1000 }),
    owner: varchar("owner", { length: ETH_ADDRESS_LENGTH }).notNull(),
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
    owner: varchar("owner", { length: ETH_ADDRESS_LENGTH }).notNull(),
    price: bigint("price", { mode: "number" }).notNull(),
    shareId: bigint("share_id", { mode: "number" }).notNull(),
    side: bigint("side", { mode: "number" }).notNull(),
    supply: bigint("supply", { mode: "number" }).notNull(),
    trader: varchar("trader", { length: ETH_ADDRESS_LENGTH }).notNull(),
  },
  (table) => ({
    shareIdIndex: uniqueIndex("shareId").on(table.shareId),
  }),
);

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    address: varchar("address", { length: ETH_ADDRESS_LENGTH }).notNull(),
    avatar: varchar("avatar", { length: 1000 }),
    username: varchar("username", { length: MAX_USERNAME_LENGTH }),
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

export const key = mysqlTable(AUTH_KEY_TABLE_NAME, {
  id: varchar("id", { length: 225 }).primaryKey(),
  hashedPassword: varchar("hashed_password", { length: 225 }),
  userId: varchar("user_id", { length: MAX_USERNAME_LENGTH }).notNull(),
});

export const session = mysqlTable(AUTH_SESSION_TABLE_NAME, {
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  id: varchar("id", { length: 128 }).primaryKey(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
  userId: varchar("user_id", { length: MAX_USERNAME_LENGTH }).notNull(),
});

export const user = mysqlTable(
  AUTH_USER_TABLE_NAME,
  {
    id: varchar("id", { length: USER_ID_LENGTH }).primaryKey(),
    address: char("address", { length: 42 }).notNull(),
  },
  (table) => ({
    addressIndex: uniqueIndex("address").on(table.address),
  }),
);
