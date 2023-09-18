"use client";
import { useState } from "react";

export const Dropzone = ({ onDrop, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          onDrop(file);
        }
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        transition: "opacity 0.3s, boxShadow 0.3s", // smooth transition for opacity and boxShadow
        boxShadow: isDragging
          ? "inset 0 0 15px 5px rgba(54, 70, 93, 0.6)"
          : "none",
      }}
    >
      {children}
    </div>
  );
};

export default Dropzone;
