import { FeedProvider } from "../FeedContext";
import { LoadMore } from "../LoadMore";
import { PostFeed } from "../PostFeed";
import { fetchFollowingPosts } from "./fetchFollowingPosts";

export default async function Following() {
  const posts = await fetchFollowingPosts({
    page: 0,
  });

  return (
    <div className="flex justify-center">
      <div className="w-full space-y-6 pb-4">
        <FeedProvider initialPosts={posts}>
          <PostFeed />
          <LoadMore />
        </FeedProvider>
      </div>
    </div>
  );
}
