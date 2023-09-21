import { User } from "lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { validateEthereumAuth } from "@/lib/auth/ethereum";
import { auth } from "@/lib/auth/lucia";
import { AuthMethod, AuthSchema } from "@/lib/auth/types";
import { createUser } from "@/lib/auth/createUser";

import { LoginResponse } from "./types";

/**
 * User login
 */
export async function POST(request: NextRequest) {
  console.log("POST function called"); // Logs when function is called

  const parsedInput = AuthSchema.safeParse(await request.json());
  console.log("Parsed Input: ", parsedInput); // Logs parsed input

  if (!parsedInput.success) {
    console.log("Invalid input"); // Logs if the input is invalid
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await validateEthereumAuth(request, parsedInput.data);
  console.log("Validation result: ", result); // Logs validation result

  if (!result) {
    console.log("Invalid signature"); // Logs if signature is invalid
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let user: User;

  try {
    const key = await auth.useKey(
      AuthMethod.Ethereum,
      result.data.address,
      null,
    );
    console.log("Key: ", key); // Logs key

    user = await auth.getUser(key.userId);
    console.log("Existing user: ", user); // Logs existing user data
  } catch (error) {
    console.log("Error in fetching existing user: ", error); // Logs error during fetching existing user

    user = await createUser({
      address: result.data.address,
      providerId: parsedInput.data.method,
      providerUserId: result.data.address,
    });
    console.log("New user created: ", user); // Logs newly created user data
  }

  const authRequest = auth.handleRequest({ cookies, request });
  console.log("Auth request: ", authRequest); // Logs auth request

  const session = await auth.createSession({
    attributes: {},
    userId: user.userId,
  });
  console.log("Session created: ", session); // Logs session data

  authRequest.setSession(session);

  const json: LoginResponse = { user };
  return NextResponse.json(json);
}
