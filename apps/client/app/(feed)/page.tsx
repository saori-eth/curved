import { LatestFeed } from "./LatestFeed";

export const revalidate = 5;

export default function Feed() {
  return (
    <div className="flex w-full justify-center pt-2 md:pt-6">
      <div className="max-w-content relative mx-2 flex w-full justify-center">
        <LatestFeed />
      </div>
    </div>
  );
}
