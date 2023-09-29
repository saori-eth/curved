"use client";

import { useState, useTransition } from "react";

import Avatar from "@/components/Avatar";
import { cropImage } from "@/lib/cropImage";

import { useAuth } from "../AuthProvider";
import { getAvatarUpload } from "./getAvatarUpload";

interface Props {
  username: string;
  avatar: string | null;
}

export function UserAvatar({ username, avatar }: Props) {
  const { user } = useAuth();

  const [pending, startTransition] = useTransition();
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  const isCurrentUser = user?.username === username;

  if (!isCurrentUser) {
    return <Avatar size={128} src={avatar} uniqueKey={username} />;
  }

  const disabled = pending || !user;

  function handleUpload() {
    if (disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      console.log("Uploading image...");

      startTransition(async () => {
        try {
          const cropped = await cropImage(URL.createObjectURL(file));

          // Get upload URL
          const { uploadUrl } = await getAvatarUpload();
          if (!uploadUrl) throw new Error("Failed to get upload URL");

          // Upload image
          const blob = new Blob([cropped], { type: cropped.type });

          const res = await fetch(uploadUrl, {
            body: blob,
            headers: {
              "Content-Type": cropped.type,
              "x-amz-acl": "public-read",
            },
            method: "PUT",
          });

          if (!res.ok) {
            console.error("Failed to upload image");
            return;
          }

          // Update user avatar
          setNewAvatar(URL.createObjectURL(cropped));
        } catch (err) {
          console.error(err);
        }
      });
    };

    input.click();
  }

  return (
    <button
      title="Upload avatar"
      onClick={handleUpload}
      className={`flex items-center justify-center rounded-full bg-slate-900 transition hover:opacity-80 active:opacity-75 ${disabled ? "cursor-default opacity-50" : ""
        }`}
    >
      <Avatar size={128} src={newAvatar ?? avatar} uniqueKey={username} />
    </button>
  );
}
