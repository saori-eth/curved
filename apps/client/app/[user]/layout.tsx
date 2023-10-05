import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchProfileFromUsername } from "@/lib/fetchProfile";

import { FeedButton } from "../(feed)/FeedButton";
import { FollowButton } from "./FollowButton";
import { RoyaltiesEarned } from "./RoyaltiesEarned";
import { UserAvatar } from "./UserAvatar";
import { Username } from "./Username";

export const revalidate = 10;

interface Props {
  params: {
    user: string;
  };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) return {};

  const title = `@${profile.username}`;
  const images = profile.avatar ? [{ url: profile.avatar }] : [];

  return {
    description: "",
    openGraph: {
      description: "",
      images,
      title,
      type: "profile",
    },
    title,
    twitter: {
      card: "summary",
      description: "",
      images,
      title,
    },
  };
}

export default async function UserLayout({ children, params }: Props) {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) notFound();

  return (
    <div className="z-20 col-span-3 flex flex-col items-center space-y-2 py-2">
      <div className="relative flex w-full flex-col items-center space-y-2">
        <UserAvatar username={profile.username} avatar={profile.avatar} />
        <Username username={profile.username} />
      </div>

      <div className="flex h-8 items-stretch">
        <FollowButton address={profile.address} username={profile.username} />
        <RoyaltiesEarned address={profile.address} />
      </div>

      <div className="flex h-9 items-stretch space-x-2 pt-1.5">
        <FeedButton href={`/@${profile.username}`}>Posts</FeedButton>
        <FeedButton href={`/@${profile.username}/collection`}>
          Collection
        </FeedButton>
      </div>

      {children}
    </div>
  );
}
