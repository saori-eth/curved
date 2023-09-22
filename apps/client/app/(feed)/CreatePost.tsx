"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState, useTransition } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

import { useAuth } from "../AuthProvider";
import { publish } from "./publish";

enum PRICE_CURVE {
  STEEP = 4000,
  NORMAL = 16000,
  GENTLE = 32000,
}

export function CreatePost() {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [priceCurve] = useState(PRICE_CURVE.NORMAL);

  const { address } = useAccount();
  const { status } = useAuth();

  const {
    config,
    isError: isErrorPrepare,
    error: errorPrepare,
    isLoading: isLoadingPrepare,
  } = usePrepareContractWrite({
    abi: CURVED_ABI,
    account: address,
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    args: [url, BigInt(priceCurve)],
    enabled: Boolean(address),
    functionName: "createShare",
  });

  const {
    write,
    isSuccess: isSuccessWrite,
    isLoading: isLoadingWrite,
    error: errorWrite,
  } = useContractWrite(config);

  const [isPublishing, startTransition] = useTransition();

  const isLoading = isLoadingPrepare || isLoadingWrite || isPublishing;
  const error = errorPrepare || errorWrite;
  const disabled =
    status !== "authenticated" || isLoading || isErrorPrepare || !write;

  useEffect(() => {
    if (!isSuccessWrite) return;
    // Transaction was sent
    setOpen(false);
  }, [isSuccessWrite]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    write();
  }

  function promptFile(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    if (disabled) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setFile(file);
      setUrl("");
      setOpen(true);

      startTransition(async () => {
        try {
          // Create db post
          const publishRes = await publish({
            description: descriptionRef.current?.value || "",
            url,
          });
          if (!publishRes) {
            console.error("Failed to publish");
            return;
          }

          const { contentUrl, uploadUrl } = publishRes;

          // Upload image
          const blob = new Blob([file], { type: file.type });

          const res = await fetch(uploadUrl, {
            body: blob,
            headers: {
              "Content-Type": file.type,
              "x-amz-acl": "public-read",
            },
            method: "PUT",
          });

          if (!res.ok) {
            console.error("Failed to upload image");
            return;
          }

          // Update url
          console.log("Uploaded image to", contentUrl);
          setUrl(contentUrl);
        } catch (e) {
          console.error(e);
        }
      });
    };
    input.click();
  }

  if (status !== "authenticated" || !address) return null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!disabled) {
          setOpen(o);
        }
      }}
    >
      <Dialog.Trigger
        onClick={promptFile}
        className="flex items-center space-x-3 rounded-2xl bg-neutral-100 p-5 text-black shadow-dark drop-shadow transition hover:bg-neutral-300 hover:shadow-lg active:opacity-90 active:drop-shadow-lg sm:px-6 sm:py-4"
      >
        <RiImageAddFill className="text-2xl" />
        <span className="hidden text-xl font-bold sm:block">Upload</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Dialog.Content className="mx-2 h-fit w-full max-w-md rounded-2xl bg-neutral-800 px-8 pb-8 pt-4 shadow-lg">
            <h1 className="pb-4 text-center text-xl font-bold">Create Post</h1>

            <form onSubmit={submit} className="space-y-4">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  onClick={promptFile}
                  className={`aspect-square w-full rounded-lg object-cover transition ${
                    disabled
                      ? "opacity-50"
                      : "hover:cursor-pointer hover:opacity-80"
                  }`}
                  alt="Upload preview"
                />
              ) : (
                <div className="h-64 w-full rounded-lg bg-neutral-700" />
              )}

              <textarea
                ref={descriptionRef}
                disabled={disabled}
                placeholder="Write a caption..."
                rows={2}
                className={`w-full rounded-lg bg-neutral-900 px-3 py-1 ${
                  disabled ? "opacity-50" : ""
                }`}
              />

              <div className="flex justify-end">
                <button
                  disabled={disabled}
                  type="submit"
                  className={`rounded-full bg-neutral-900 px-4 py-1 ${
                    disabled
                      ? "opacity-50"
                      : "transition hover:bg-black active:opacity-90"
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>

            {error && (
              <p className="overflow-hidden text-ellipsis text-xs text-red-500">
                {error.message}
              </p>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
