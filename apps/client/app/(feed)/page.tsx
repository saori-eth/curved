import { FeedProvider } from "./FeedContext";
import { fetchLatestPosts } from "./fetchLatestPosts";
import { LoadMore } from "./LoadMore";
import { PostFeed } from "./PostFeed";

export default async function Feed() {
  const posts = await fetchLatestPosts({
    page: 0,
  });

  return (
    <div className="flex h-screen w-full justify-center">
      <div className="w-full space-y-6 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore />
        </FeedProvider>
      </div>
    </div>
  );
}
