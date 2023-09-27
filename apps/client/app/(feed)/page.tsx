import { LatestFeed } from "./LatestFeed";

export const revalidate = 5;

export default function Feed() {
  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full pb-24 md:pb-0">
        <LatestFeed />
      </div>
    </div>
  );
}
