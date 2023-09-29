"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useConnectModal } from "@rainbow-me/rainbowkit";
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
import { env } from "@/lib/env.mjs";

import { useAuth } from "../AuthProvider";
import { editPending } from "./editPending";
import { getPublishedId } from "./getPublishedId";

export function CreatePost() {
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [waitingForIndex, setWaitingForIndex] = useState(false);

  const { address } = useAccount();
  const { status } = useAuth();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  const {
    config,
    isError: isErrorPrepare,
    error: errorPrepare,
    isLoading: isLoadingPrepare,
  } = usePrepareContractWrite({
    abi: CURVED_ABI,
    account: address,
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
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

  const [isRedirecting, startRedirectTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  const isError = Boolean(errorPrepare || errorWrite);

  const imageDisabled =
    status !== "authenticated" ||
    isLoadingWrite ||
    isUploading ||
    isRedirecting ||
    isWaitingOnTx ||
    waitingForIndex;

  const descriptionDisabled =
    isLoadingWrite || isRedirecting || isWaitingOnTx || waitingForIndex;

  const submitDisabled =
    isLoadingPrepare ||
    isLoadingWrite ||
    isUploading ||
    isRedirecting ||
    isWaitingOnTx ||
    waitingForIndex ||
    !write ||
    status !== "authenticated" ||
    isErrorPrepare;

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

          startRedirectTransition(() => {
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
        startRedirectTransition(() => {
          console.error("Failed to get shareId");
          clearInterval(interval);
          setOpen(false);
          setWaitingForIndex(false);
          router.push("/");
        });
      }
    }, 2000);
  }, [isTxMined, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitDisabled) return;

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

    // Connect wallet if not connected
    if (!address) {
      if (openConnectModal) {
        openConnectModal();
        return;
      }
    }

    if (imageDisabled) return;

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
          success: function(compressedFile) {
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

      startUploadTransition(async () => {
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(open);
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  if (status !== "authenticated") return null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (open) {
          if (
            isUploading ||
            isLoadingWrite ||
            isRedirecting ||
            isWaitingOnTx ||
            waitingForIndex
          ) {
            return;
          }
        }

        setOpen(o);
      }}
    >
      <Dialog.Trigger
        onClick={promptFile}
        className="flex items-center justify-center space-x-2 rounded-2xl bg-white p-5 text-black shadow-dark drop-shadow transition hover:bg-slate-200 hover:shadow-lg active:scale-95 active:drop-shadow-lg md:w-full md:px-6 md:py-4"
      >
        <span className="text-xl">📷</span>
        <span className="hidden text-xl font-bold md:block">Upload</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-10 flex items-center justify-center bg-black/75 backdrop-blur-sm transition ${mounted ? "" : "opacity-0"
            }`}
        >
          <Dialog.Content
            className={`mx-2 h-fit w-full max-w-md rounded-2xl bg-slate-800 px-8 pb-8 pt-4 shadow-lg transition ${mounted ? "" : "scale-75 opacity-0"
              }`}
          >
            <h1 className="pb-4 text-center text-xl font-bold">Create Post</h1>

            <form onSubmit={submit} className="space-y-4">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  onClick={promptFile}
                  className={`aspect-square w-full rounded-lg object-cover transition ${imageDisabled
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
                disabled={descriptionDisabled}
                placeholder="Write a caption..."
                rows={2}
                className={`w-full rounded-lg bg-slate-900 px-3 py-1 ${descriptionDisabled ? "opacity-50" : ""
                  }`}
              />

              <div className="flex justify-center">
                <button
                  disabled={submitDisabled}
                  type="submit"
                  className={`rounded-full bg-slate-900 px-4 py-1 ${submitDisabled
                      ? "opacity-50"
                      : "transition hover:bg-slate-950 active:opacity-90"
                    }`}
                >
                  Submit
                </button>
              </div>
            </form>

            {isError ? (
              <p className="pt-4 text-center text-sm text-red-500">
                Error creating post.
              </p>
            ) : isWaitingOnTx ? (
              <p className="pt-4 text-center text-sm text-slate-500">
                Waiting for transaction to be mined...
              </p>
            ) : isTxMined ? (
              <p className="pt-4 text-center text-sm text-sky-400">
                Success! Waiting for indexer...
              </p>
            ) : null}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
