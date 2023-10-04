import { FeedButton } from "./FeedButton";

interface Props {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: Props) {
  return (
    <div className="flex justify-center md:relative">
      <div className="fixed top-0 z-50 flex h-14 w-full items-center justify-center space-x-2 bg-slate-800/95 backdrop-blur-lg md:h-16 md:w-2/3 md:max-w-2xl">
        <FeedButton href="/">Latest</FeedButton>
        <FeedButton href="/following">Following</FeedButton>
      </div>

      <div className="w-full pt-14">{children}</div>
    </div>
  );
}
