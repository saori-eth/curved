import { PostCard } from "./PostCard";

const mockPost = [
  {
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    buttons: ["Buy", "Sell"],
    description: "This is a sample description for the first card.",
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    title: "Sample Title 1",
  },
  {
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    buttons: ["Buy", "Sell"],
    description: "This is a sample description for the first card.",
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    title: "Sample Title 1",
  },
];

export function PostCardFeed() {
  return (
    <div className="no-scrollbar flex h-screen flex-col items-center overflow-y-scroll pt-14">
      {mockPost.map((post, i) => (
        <PostCard key={`${post.title}${i}`} {...post} />
      ))}
    </div>
  );
}
