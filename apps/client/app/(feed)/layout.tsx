import { FeedButton } from "./FeedButton";

interface Props {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: Props) {
  return (
    <div className="relative flex justify-center">
      <div className="fixed top-0 flex h-16 w-full items-center justify-center space-x-2 bg-slate-800/95 backdrop-blur-lg md:w-2/3 md:max-w-2xl">
        <FeedButton href="/">Latest</FeedButton>
        <FeedButton href="/following">Following</FeedButton>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}
