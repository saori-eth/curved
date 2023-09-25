"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Compressor from "compressorjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

import { useAuth } from "../AuthProvider";
import { editPending } from "./editPending";
import { getPublishedId } from "./getPublishedId";

export function CreatePost() {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [waitingForIndex, setWaitingForIndex] = useState(false);

  const { address } = useAccount();
  const { status } = useAuth();
  const router = useRouter();

  const {
    config,
    isError: isErrorPrepare,
    error: errorPrepare,
    isLoading: isLoadingPrepare,
  } = usePrepareContractWrite({
    abi: CURVED_ABI,
    account: address,
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as `0x${string}`,
    args: [url],
    enabled: Boolean(address),
    functionName: "createShare",
  });

  const {
    write,
    isLoading: isLoadingWrite,
    data,
    error: errorWrite,
  } = useContractWrite(config);

  const { isSuccess: isTxMined, isLoading: isWaitingOnTx } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const [isTransitioning, startTransition] = useTransition();

  const isLoading =
    isLoadingPrepare ||
    isLoadingWrite ||
    isTransitioning ||
    isWaitingOnTx ||
    waitingForIndex;
  const error = errorPrepare || errorWrite;
  const disabled =
    status !== "authenticated" ||
    !address ||
    isLoading ||
    isErrorPrepare ||
    !write;

  useEffect(() => {
    if (!isTxMined) return;
    console.log("Transaction mined");

    setWaitingForIndex(true);

    let tries = 0;

    const interval = setInterval(async () => {
      tries++;

      try {
        const shareId = await getPublishedId();

        if (shareId) {
          clearInterval(interval);

          startTransition(() => {
            console.log("Redirecting");
            setOpen(false);
            setWaitingForIndex(false);
            router.push(`/post/${shareId}`);
          });

          return;
        }
      } catch (e) {
        console.error(e);
      }

      if (tries > 20) {
        console.error("Failed to get shareId");
        clearInterval(interval);
        setWaitingForIndex(false);
      }
    }, 2000);
  }, [isTxMined, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;

    // Send transaction
    write();

    // Set description
    try {
      await editPending({
        description: descriptionRef.current?.value ?? "",
      });
    } catch (e) {
      console.error(e);
    }
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

      if (file.type.startsWith("image/gif")) {
        new Compressor(file, {
          error(err) {
            console.log(err.message);
          },
          maxWidth: 480,
          quality: 0.6,
          success: function (compressedFile) {
            setFile(
              new File([compressedFile], "compressed.gif", {
                type: "image/gif",
              }),
            );
          },
        });
      } else {
        setFile(file);
      }

      setUrl("");
      setOpen(true);

      startTransition(async () => {
        // Create db post
        const createdRes = await fetch("/api/pending", {
          method: "POST",
        });

        if (!createdRes.ok) {
          console.error("Failed to create pending");
          return;
        }

        const created = (await createdRes.json()) as {
          url: string;
          uploadUrl: string;
        };

        console.log("Created pending");
        setUrl(created.url);

        // Upload image
        const blob = new Blob([file], { type: file.type });

        const res = await fetch(created.uploadUrl, {
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

        console.log("Uploaded image to", created.url);
      });
    };

    input.click();
  }

  if (status !== "authenticated" || !address) return null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (open && disabled) return;
        setOpen(o);
      }}
    >
      <Dialog.Trigger
        onClick={promptFile}
        className="flex items-center space-x-2 rounded-2xl bg-slate-100 p-5 text-black shadow-dark drop-shadow transition hover:bg-slate-300 hover:shadow-lg active:opacity-90 active:drop-shadow-lg md:w-full md:px-6 md:py-4"
      >
        <span className="text-xl">📷</span>
        <span className="hidden text-xl font-bold md:block">Upload</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Dialog.Content className="mx-2 h-fit w-full max-w-md rounded-2xl bg-slate-800 px-8 pb-8 pt-4 shadow-lg">
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
                <div className="h-64 w-full rounded-lg bg-slate-700" />
              )}

              <textarea
                ref={descriptionRef}
                disabled={disabled}
                placeholder="Write a caption..."
                rows={2}
                className={`w-full rounded-lg bg-slate-900 px-3 py-1 ${
                  disabled ? "opacity-50" : ""
                }`}
              />

              <div className="flex justify-end">
                <button
                  disabled={disabled}
                  type="submit"
                  className={`rounded-full bg-slate-900 px-4 py-1 ${
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
