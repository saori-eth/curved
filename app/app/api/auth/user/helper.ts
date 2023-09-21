import { UpdateUserInput } from "./types";

export const ERR_USERNAME_TAKEN = "Username is taken";

export async function updateUser(args: UpdateUserInput) {
  const res = await fetch("/api/auth/user", {
    body: JSON.stringify(args),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  });

  if (!res.ok) {
    if (res.status === 409) throw new Error(ERR_USERNAME_TAKEN);
    throw new Error(await res.text());
  }
}
