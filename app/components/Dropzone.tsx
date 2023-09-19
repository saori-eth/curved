import { useState } from "react";

export const Dropzone = ({
  onDrop,
  children,
}: {
  onDrop: (file: File) => void;
  children: React.ReactNode;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    for (const file of e.dataTransfer.files) {
      onDrop(file);
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
