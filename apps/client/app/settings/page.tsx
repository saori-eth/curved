import { getSession } from "@/lib/auth/getSession";

import { LogoutButton } from "./LogoutButton";
import { ProfileSettings } from "./ProfileSettings";

export default async function Settings() {
  const session = await getSession();
  if (!session) {
    return (
      <p className="z-20 col-span-3 pt-2 text-center text-slate-400">
        You must be logged in to view this page.
      </p>
    );
  }

  return (
    <div className="z-20 mx-4 space-y-8 pt-4 md:col-span-3 md:w-full md:pt-2">
      <h1 className="text-center text-2xl font-bold">Account</h1>

      <ProfileSettings
        avatar={session.user.avatar}
        username={session.user.username}
      />

      <hr className="border-slate-700" />

      <LogoutButton />
    </div>
  );
}
