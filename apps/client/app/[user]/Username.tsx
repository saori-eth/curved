"use client";

import { useRef, useState, useTransition } from "react";
import { MdCheck, MdEdit } from "react-icons/md";

import { MAX_USERNAME_LENGTH } from "@/lib/db/constants";

import { useAuth } from "../AuthProvider";
import { editUsername } from "./editUsername";

interface Props {
  username: string;
}

export function Username({ username }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const [pending, startTransition] = useTransition();

  const [value, setValue] = useState(username);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const isCurrentUser = user?.username === username;

  if (!isCurrentUser) {
    return <h1 className="text-center text-xl font-bold">@{username}</h1>;
  }

  const disabled = pending || !editing;

  function handleEdit() {
    setEditing(true);
    ref.current?.focus();
  }

  function handleSave() {
    if (disabled) return;

    setError("");

    if (value === username) {
      // No change
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const { message, success } = await editUsername({ value });
      if (!success) {
        setError(message);
        return;
      }

      window.location.pathname = `@${value}`;
      setEditing(false);
    });
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        value={`@${value}`}
        onChange={(e) => {
          // Strip @
          const newValue = e.target.value.replace("@", "");
          setValue(newValue);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave();
          }

          if (e.key === "Escape") {
            setValue(username);
            setEditing(false);
          }
        }}
        pattern="[a-zA-Z0-9_]+"
        minLength={3}
        maxLength={MAX_USERNAME_LENGTH}
        disabled={disabled}
        className={`w-fit rounded text-center text-xl font-bold ${editing
            ? "bg-slate-900"
            : pending
              ? "bg-transparent opacity-50"
              : "bg-transparent"
          }`}
      />

      {error && (
        <p className="mt-1 text-center text-sm text-red-500">{error}</p>
      )}

      <button
        onClick={editing ? handleSave : handleEdit}
        title={editing ? "Save changes" : "Edit username"}
        className="absolute inset-y-0 right-0 flex aspect-square items-center justify-center rounded-full p-1 text-slate-400 transition hover:text-white active:opacity-80"
      >
        {editing ? <MdCheck /> : <MdEdit />}
      </button>
    </div>
  );
}
