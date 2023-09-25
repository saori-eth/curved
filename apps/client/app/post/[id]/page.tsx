import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchPost } from "@/lib/fetchPost";

import { PostPage } from "./PostPage";

export const revalidate = 30;

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.id);
  if (!post) {
    return {};
  }

  const title = `Post by @${post.owner.username}`;

  return {
    authors: [
      {
        name: `@${post.owner.username}`,
        url: `https://yuyu.social/@${post.owner.username}`,
      },
    ],
    description: post.description,
    openGraph: {
      description: post.description,
      images: [
        {
          url: post.url,
        },
      ],
      title,
      type: "website",
    },
    title,
    twitter: {
      card: "summary_large_image",
      description: post.description,
      images: [
        {
          url: post.url,
        },
      ],
      title,
    },
  };
}

export default async function Post({ params }: Props) {
  const post = await fetchPost(params.id);
  if (!post) {
    notFound();
  }

  return (
    <div className="py-4">
      <PostPage post={post} />
    </div>
  );
}
