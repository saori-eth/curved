import { baseMetadata } from "@/app/baseMetadata";
import { getSession } from "@/lib/auth/getSession";

import { LogoutButton } from "./LogoutButton";
import { ProfileSettings } from "./ProfileSettings";

export function generateMetadata() {
  const title = "Settings";

  return {
    openGraph: {
      ...baseMetadata.openGraph,
      title,
    },
    title,
    twitter: {
      ...baseMetadata.twitter,
      title,
    },
  };
}

export default async function Settings() {
  const session = await getSession();
  if (!session) {
    return (
      <p className="z-20 col-span-3 pt-2 text-center text-amber-500">
        You must be logged in to view your settings.
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
