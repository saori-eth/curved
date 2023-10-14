import Link from "next/link";
import { MdEdit } from "react-icons/md";

import { getSession } from "@/lib/auth/getSession";

interface Props {
  username: string;
}

export async function EditProfile({ username }: Props) {
  const session = await getSession();

  if (!session || session.username !== username) {
    return null;
  }

  return (
    <Link
      href="/settings"
      title="Edit profile"
      className="absolute right-4 top-2 rounded-full p-1 text-slate-400 transition active:text-white md:right-0 md:top-0 md:hover:text-white"
    >
      <MdEdit className="text-xl" />
    </Link>
  );
}
