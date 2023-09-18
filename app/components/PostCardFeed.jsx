import { PostCard } from "../components";

const mockPost = [
  {
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    title: "Sample Title 1",
    description: "This is a sample description for the first card.",
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    buttons: ["Buy", "Sell"],
  },
  {
    author: "Saori",
    avatar:
      "https://pbs.twimg.com/profile_images/1699999020679139328/8pur40mN_400x400.jpg",
    title: "Sample Title 1",
    description: "This is a sample description for the first card.",
    image: "https://i.imgur.com/6T3pNMB.jpeg",
    buttons: ["Buy", "Sell"],
  },
];

export const PostCardFeed = ({ children }) => {
  return (
    <div className="flex flex-col items-center py-2">
      {mockPost.map((post, i) => (
        <PostCard key={`${post.title}${i}`} {...post} />
      ))}
    </div>
  );
};
