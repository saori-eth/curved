import { baseMetadata } from "@/app/baseMetadata";
import { getSession } from "@/lib/auth/getSession";

import { FeedProvider } from "../FeedContext";
import { LoadMore } from "../LoadMore";
import { PostFeed } from "../PostFeed";
import { fetchFollowingPosts } from "./fetchFollowingPosts";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  const title = "Following";

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

export default async function Following() {
  const session = await getSession();
  if (!session) {
    return (
      <p className="text-center text-slate-500">
        You must be signed in to view this page.
      </p>
    );
  }

  const posts = await fetchFollowingPosts({
    page: 0,
  });

  if (posts.length === 0) {
    return (
      <p className="text-center text-slate-500">
        Posts from people you follow will appear here!
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full space-y-2 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore fetchType="following" />
        </FeedProvider>
      </div>
    </div>
  );
}
