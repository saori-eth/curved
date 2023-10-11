import { FeedProvider } from "./FeedContext";
import { fetchLatestPosts } from "./fetchLatestPosts";
import { LoadMore } from "./LoadMore";
import { PostFeed } from "./PostFeed";

export const revalidate = 5;
export const dynamic = "force-dynamic";

export default async function Feed() {
  const posts = await fetchLatestPosts({
    page: 0,
  });

  return (
    <div className="flex justify-center">
      <div className="w-full space-y-2 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore fetchType="latest" />
        </FeedProvider>
      </div>
    </div>
  );
}
