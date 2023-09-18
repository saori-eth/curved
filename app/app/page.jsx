"use client";
import { PostCardFeed } from "../components";
import { Dropzone } from "../components";

const handleDrop = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result);
  };
  reader.readAsDataURL(file);
};

const Page = () => {
  return (
    <>
      <Dropzone onDrop={handleDrop}>
        <PostCardFeed />
      </Dropzone>
    </>
  );
};

export default Page;
