import { nanoidLowercase } from "../db/nanoid";
import { auth } from "./lucia";

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
  const data = await auth.createUser({
    attributes: {
      address,
      avatar: "",
      username: nanoidLowercase(10),
    },
    key: {
      password: null,
      providerId,
      providerUserId,
    },
  });

  return data;
}
