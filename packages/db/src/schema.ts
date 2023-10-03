import { relations, sql } from "drizzle-orm";
import {
  bigint,
  char,
  index,
  mysqlTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import {
  AUTH_KEY_TABLE_NAME,
  AUTH_SESSION_TABLE_NAME,
  AUTH_USER_TABLE_NAME,
  ETH_ADDRESS_LENGTH,
  ETH_AUTH_NONCE_LENGTH,
  MAX_CAPTION_LENGTH,
  MAX_USERNAME_LENGTH,
  NANOID_LENGTH,
  USER_ID_LENGTH,
} from "./constants";

export const post = mysqlTable(
  "post",
  {
    caption: varchar("caption", { length: MAX_CAPTION_LENGTH }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: ETH_ADDRESS_LENGTH }).notNull(),
    shareId: bigint("share_id", { mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
    url: varchar("url", { length: 255 }).notNull(),
  },
  (table) => ({
    ownerIndex: index("owner").on(table.owner),
    shareIdIndex: uniqueIndex("shareId").on(table.shareId),
  }),
);

export const postRelations = relations(post, ({ one }) => ({
  owner: one(user, {
    fields: [post.owner],
    references: [user.address],
  }),
}));

export const pendingPost = mysqlTable(
  "pending_post",
  {
    caption: varchar("caption", { length: MAX_CAPTION_LENGTH }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: serial("id").primaryKey(),
    owner: varchar("owner", { length: ETH_ADDRESS_LENGTH }).notNull(),
    publicId: char("public_id", { length: NANOID_LENGTH }).notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
    url: varchar("url", { length: 255 }).notNull(),
  },
  (table) => ({
    ownerIndex: index("owner").on(table.owner),
  }),
);

export const repost = mysqlTable(
  "repost",
  {
    caption: varchar("caption", { length: MAX_CAPTION_LENGTH }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: serial("id").primaryKey(),
    referenceRepostId: bigint("reference_repost", { mode: "number" }),
    referenceShareId: bigint("share_id", { mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
    userId: varchar("user_id", { length: USER_ID_LENGTH }).notNull(),
  },
  (table) => ({
    shareIdIndex: uniqueIndex("shareId").on(table.referenceShareId),
  }),
);

export const repostRelations = relations(repost, ({ one }) => ({
  referenceRepost: one(repost, {
    fields: [repost.referenceRepostId],
    references: [repost.id],
  }),
  user: one(user, {
    fields: [repost.userId],
    references: [user.id],
  }),
}));

export const trade = mysqlTable("trade", {
  amount: bigint("amount", { mode: "number" }).notNull(),
  hash: varchar("hash", { length: 66 }).notNull(),
  id: serial("id").primaryKey(),
  owner: varchar("owner", { length: ETH_ADDRESS_LENGTH }).notNull(),
  price: bigint("price", { mode: "number" }).notNull(),
  shareId: bigint("share_id", { mode: "number" }).notNull(),
  side: bigint("side", { mode: "number" }).notNull(),
  supply: bigint("supply", { mode: "number" }).notNull(),
  trader: varchar("trader", { length: ETH_ADDRESS_LENGTH }).notNull(),
});

export const follow = mysqlTable(
  "follow",
  {
    following: varchar("following", { length: ETH_ADDRESS_LENGTH }).notNull(),
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: USER_ID_LENGTH }).notNull(),
  },
  (table) => ({
    followingIndex: index("following").on(table.following),
    userIdIndex: index("userId").on(table.userId),
  }),
);

export const followRelations = relations(follow, ({ one }) => ({
  following: one(user, {
    fields: [follow.following],
    references: [user.address],
  }),
  user: one(user, {
    fields: [follow.userId],
    references: [user.id],
  }),
}));

export const user = mysqlTable(
  AUTH_USER_TABLE_NAME,
  {
    address: char("address", { length: ETH_ADDRESS_LENGTH }).notNull(),
    avatarId: varchar("avatarId", { length: NANOID_LENGTH }),
    id: varchar("id", { length: USER_ID_LENGTH }).primaryKey(),
    username: varchar("username", { length: MAX_USERNAME_LENGTH }).notNull(),
  },
  (table) => ({
    addressIndex: uniqueIndex("address").on(table.address),
    usernameIndex: uniqueIndex("username").on(table.username),
  }),
);

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  reposts: many(repost),
}));

export const ethereumSession = mysqlTable(
  "auth_ethereum_session",
  {
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: serial("id").primaryKey(),
    nonce: char("nonce", { length: ETH_AUTH_NONCE_LENGTH }).notNull(),
    publicId: char("public_id", { length: NANOID_LENGTH }).notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    publicIdIndex: uniqueIndex("publicId").on(table.publicId),
  }),
);

export const key = mysqlTable(AUTH_KEY_TABLE_NAME, {
  hashedPassword: varchar("hashed_password", { length: 225 }),
  id: varchar("id", { length: 225 }).primaryKey(),
  userId: varchar("user_id", { length: MAX_USERNAME_LENGTH }).notNull(),
});

export const session = mysqlTable(AUTH_SESSION_TABLE_NAME, {
  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),
  id: varchar("id", { length: 128 }).primaryKey(),
  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
  userId: varchar("user_id", { length: MAX_USERNAME_LENGTH }).notNull(),
});
