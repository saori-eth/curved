"use client";
import { Dropzone } from "./Dropzone";

export const Body = ({ children }) => {
  const handleDrop = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("blob: ", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <Dropzone onDrop={handleDrop}>{children}</Dropzone>
    </div>
  );
};
