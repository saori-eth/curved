import { CreatePost } from "./CreatePost";
import { LatestFeed } from "./LatestFeed";

export const revalidate = 5;

export default function Feed() {
  return (
    <div className="flex w-full justify-center pt-14">
      <div className="relative mx-2 flex w-full max-w-5xl justify-center">
        <LatestFeed />

        <div className="absolute right-0">
          <div className="fixed bottom-8">
            <div className="fixed bottom-4 right-4 z-10 sm:absolute sm:bottom-0 sm:right-0">
              <CreatePost />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
