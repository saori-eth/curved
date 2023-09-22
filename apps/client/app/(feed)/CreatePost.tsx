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

  const [url] = useState("https://i.imgur.com/6T3pNMB.jpeg");
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
    isError: isErrorWrite,
    error: errorWrite,
  } = useContractWrite(config);

  const [isPublishing, startTransition] = useTransition();

  const isLoading = isLoadingPrepare || isLoadingWrite || isPublishing;
  const isError = isErrorPrepare || isErrorWrite;
  const error = errorPrepare || errorWrite;
  const disabled = status !== "authenticated" || isLoading || isError || !write;

  function sendTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    write();
  }

  useEffect(() => {
    if (!isSuccessWrite) return;

    // Transaction was sent, upload data
    startTransition(() => {
      publish({
        description: descriptionRef.current?.value || "",
        url,
      });

      if (descriptionRef.current) {
        descriptionRef.current.value = "";
      }
    });
  }, [isSuccessWrite, url]);

  if (status !== "authenticated") return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger className="flex items-center space-x-3 rounded-2xl bg-neutral-100 p-5 text-black shadow-dark drop-shadow transition hover:bg-neutral-300 hover:shadow-lg active:opacity-90 active:drop-shadow-lg sm:px-6 sm:py-4">
        <RiImageAddFill className="text-2xl" />
        <span className="hidden text-xl font-bold sm:block">Upload</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Dialog.Content className="mx-2 h-fit w-full max-w-md rounded-lg border border-neutral-400 bg-neutral-800 p-4">
            <form onSubmit={sendTx} className="space-y-2">
              <label className="block">
                <span className="text-neutral-400">Description</span>
                <textarea
                  ref={descriptionRef}
                  disabled={disabled}
                  className={`w-full rounded border border-neutral-400 bg-neutral-900 px-2 ${
                    disabled ? "opacity-50" : ""
                  }`}
                />
              </label>

              <button
                disabled={disabled}
                type="submit"
                className={`rounded bg-neutral-900 px-2 py-0.5 ${
                  disabled ? "opacity-50" : "hover:bg-black active:opacity-90"
                }`}
              >
                Submit
              </button>

              {error && <p className="text-xs text-red-500">{error.message}</p>}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
