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

  async function connectTwitter() {
    const res = await fetch("/api/auth/methods/twitter/connect");
  }

  return (
    <div>
      <button
        onClick={connectTwitter}
        className="rounded-full bg-sky-600 px-4 font-bold"
      >
        Twitter
      </button>
    </div>
  );
}
