import { LatestFeed } from "./LatestFeed";

export const revalidate = 5;

export default function Feed() {
  return (
    <div className="flex w-full justify-center pt-4 md:pt-16">
      <div className="relative w-full">
        <LatestFeed />
      </div>
    </div>
  );
}
