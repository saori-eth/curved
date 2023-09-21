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

  console.log("doing auth.createUser thing");
  const user = await auth.createUser({
    attributes: {
      address,
    } as GlobalDatabaseUserAttributes,
    key: {
      password: null,
      providerId,
      providerUserId,
    },
  });

  // Create profile
  console.log("doing db.insert thing");
  await db.insert(users).values({
    address: address,
  });

  return user;
}
