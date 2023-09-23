import { fetchLatestPosts } from "@/app/(feed)/fetchLatestPosts";

import { FeedProvider } from "./FeedContext";
import { LoadMore } from "./LoadMore";
import { PostFeed } from "./PostFeed";

export async function LatestFeed() {
  const posts = await fetchLatestPosts({
    page: 0,
  });

  return (
    <div className="no-scrollbar flex w-full justify-center overflow-y-auto pt-4">
      <div className="w-full max-w-sm space-y-4 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore />
        </FeedProvider>
      </div>
    </div>
  );
}
