import { PostCardFeed } from "../../components/PostCardFeed";
import { CreatePost } from "./CreatePost";

export default function Feed() {
  return (
    <div className="flex w-full justify-center pt-14">
      <div className="mx-4 flex w-full max-w-6xl justify-center">
        <PostCardFeed />
        <CreatePost />
      </div>
    </div>
  );
}
