import { RiTwitterXFill } from "react-icons/ri";

import { getSession } from "@/lib/auth/getSession";

interface Props {
  username: string;
  twitterUsername: string | null;
}

export async function TwitterUsername({ username, twitterUsername }: Props) {
  const session = await getSession();

  if (!twitterUsername && session?.user.username !== username) {
    return null;
  }

  const href = twitterUsername
    ? `https://twitter.com/${twitterUsername}`
    : "/api/auth/methods/twitter/connect";

  const target = twitterUsername ? "_blank" : "_self";

  return (
    <a
      href={href}
      target={target}
      className="flex items-center space-x-1 rounded-full bg-slate-900 px-3 font-bold transition hover:bg-slate-950 active:opacity-90"
    >
      <RiTwitterXFill className="text-sm" />
      <span>{twitterUsername}</span>
    </a>
  );
}
