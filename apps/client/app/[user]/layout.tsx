import { Metadata } from "next";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

import Avatar from "@/components/Avatar";
import { fetchProfileFromUsername } from "@/lib/fetchProfile";

import { FeedButton } from "../(feed)/FeedButton";
import { FollowButton } from "./FollowButton";
import { TwitterUsername } from "./TwitterUsername";

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
  const description = `View ${profile.username}'s profile on yuyu.social.`;
  const images = profile.avatar ? [{ url: profile.avatar }] : [];

  return {
    description,
    openGraph: {
      description,
      images,
      title,
      type: "profile",
    },
    title: { default: title, template: `%s • yuyu.social` },
    twitter: {
      card: "summary",
      description,
      images,
      title,
    },
  };
}

export default async function UserLayout({ children, params }: Props) {
  // Strip @ from username
  const username = params.user.replace("%40", "");

  const profile = await fetchProfileFromUsername(username);
  if (!profile) {
    return (
      <p className="z-20 col-span-3 pt-2 text-center text-slate-400">
        User not found.
      </p>
    );
  }

  return (
    <div className="relative z-20 col-span-3 flex flex-col items-center space-y-2 pb-8 pt-6 md:pb-2">
      <div className="relative flex w-full flex-col items-center space-y-2">
        <Avatar src={profile.avatar} uniqueKey={profile.username} size={128} />
        <h3 className="text-2xl font-bold">{profile.username}</h3>
      </div>

      <Link
        href="/settings"
        title="Edit profile"
        className="absolute right-4 top-2 rounded-full p-1 text-slate-400 transition active:text-white md:right-0 md:top-0 md:hover:text-white"
      >
        <MdEdit className="text-xl" />
      </Link>

      <TwitterUsername
        username={profile.username}
        twitterUsername={profile.twitterUsername}
      />

      <div className="py-1.5">
        <FollowButton address={profile.address} username={profile.username} />
      </div>

      <div className="flex items-center">
        <FeedButton href={`/@${profile.username}`}>Posts</FeedButton>
        <FeedButton href={`/@${profile.username}/collection`}>
          Collection
        </FeedButton>
      </div>

      {children}
    </div>
  );
}
