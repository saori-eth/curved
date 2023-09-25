import { fetchLatestPosts } from "@/app/(feed)/fetchLatestPosts";

import { FeedProvider } from "./FeedContext";
import { LoadMore } from "./LoadMore";
import { PostFeed } from "./PostFeed";

export async function LatestFeed() {
  const posts = await fetchLatestPosts({
    page: 0,
  });

  return (
    <div className="no-scrollbar flex w-full justify-center overflow-y-auto">
      <div className="w-full space-y-4 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore />
        </FeedProvider>
      </div>
    </div>
  );
}
