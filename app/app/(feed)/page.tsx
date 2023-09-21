import { PostCardFeed } from "../../components/PostCardFeed";
import { CreatePost } from "./CreatePost";

export default function Feed() {
  return (
    <div className="flex h-screen w-screen justify-center pt-14">
      <PostCardFeed />
      <CreatePost />
    </div>
  );
}
