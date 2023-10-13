import { AppTitle } from "../AppTitle";
import { FeedButton } from "./FeedButton";
import { RefreshButton } from "./RefreshButton";
import { RewardsLink } from "./RewardsLink";

interface Props {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: Props) {
  return (
    <div className="z-20 col-span-3 flex justify-center md:relative">
      <div className="max-w-content fixed top-0 z-50 w-full bg-slate-800 px-3 py-2 shadow backdrop-blur-lg md:h-16 md:bg-slate-800/95 md:py-0 md:shadow-none">
        <div className="w-fit md:flex md:h-full md:items-center">
          <AppTitle />
        </div>

        <div className="absolute right-3 top-0 flex h-full items-center">
          <RewardsLink />
        </div>
      </div>

      <div className="w-full pt-14 md:pt-2">
        <div className="mb-2 flex items-center justify-center">
          <FeedButton href="/">Latest</FeedButton>
          <FeedButton href="/following">Following</FeedButton>
          <RefreshButton />
        </div>

        {children}
      </div>
    </div>
  );
}
