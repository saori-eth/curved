import { getSession } from "@/lib/auth/getSession";

interface Props {
  username: string;
}

export async function TwitterLink({ username }: Props) {
  const session = await getSession();

  if (session?.user.username !== username) {
    return null;
  }

  return (
    <a
      href="/api/auth/methods/twitter/connect"
      className="h-6 rounded-full bg-sky-600 px-4 font-bold transition hover:bg-sky-500 active:opacity-90"
    >
      Link Twitter
    </a>
  );
}
