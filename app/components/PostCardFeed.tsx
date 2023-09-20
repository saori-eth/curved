import { PostCard } from "./PostCard";

type Post = {
  title: string;
  description: string;
  image: string;
  author: string;
  avatar: string;
  price: number;
};

const mockPost: Post[] = [];

for (let i = 0; i < 6; i++) {
  mockPost.push({
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    description: "This is a sample description for the first card.",
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    price: 0.0156,
    title: "Sample Title 1",
  });
}

export function PostCardFeed() {
  return (
    <div className="no-scrollbar flex h-screen flex-col items-center space-y-6 overflow-y-scroll pt-20">
      {mockPost.map((post, i) => (
        <PostCard key={`${post.title}${i}`} {...post} />
      ))}
    </div>
  );
}
