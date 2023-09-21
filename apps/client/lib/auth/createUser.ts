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
  console.log("doing auth.createUser thing");
  const data = await auth.createUser({
    attributes: {
      address,
      avatar: "",
      username: nanoidLowercase(),
    },
    key: {
      password: null,
      providerId,
      providerUserId,
    },
  });

  return data;
}
