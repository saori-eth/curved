import { GlobalDatabaseUserAttributes } from "lucia";

import { auth } from "./lucia";
import { db } from "../db";
import { users } from "../db/schema";

export async function createUser({
  providerId,
  providerUserId,
  address,
}: {
  providerId: string;
  providerUserId: string;
  address: string;
}) {
  // Create user

  const user = await auth.createUser({
    attributes: {
      address,
      username: address,
    } as GlobalDatabaseUserAttributes,
    key: {
      password: null,
      providerId,
      providerUserId,
    },
  });

  // Create profile
  await db.insert(users).values({
    address: address,
  });

  return user;
}
