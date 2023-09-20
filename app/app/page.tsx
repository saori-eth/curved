"use client";

import Dropzone from "../components/Dropzone";
import { PostCardFeed } from "../components/PostCardFeed";

const handleDrop = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result);
  };
  reader.readAsDataURL(file);
};

export default function Page() {
  return (
    <Dropzone onDrop={handleDrop}>
      <PostCardFeed />
    </Dropzone>
  );
}
