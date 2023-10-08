"use client";

import { useAuth } from "../AuthProvider";

interface Props {
  username: string;
}

export async function TwitterLink({ username }: Props) {
  const { user } = useAuth();

  if (user?.username !== username) {
    return null;
  }

  return (
    <div>
      <a
        href="/api/auth/methods/twitter/connect"
        className="rounded-full bg-sky-600 px-4 font-bold"
      >
        Twitter
      </a>
    </div>
  );
}
