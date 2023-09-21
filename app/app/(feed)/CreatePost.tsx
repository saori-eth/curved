"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { CURVED_ABI } from "@/lib/abi/curved";

import { publish } from "./publish";

enum PRICE_CURVE {
  STEEP = 4000,
  NORMAL = 16000,
  GENTLE = 32000,
}

export function CreatePost() {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [url] = useState("https://i.imgur.com/6T3pNMB.jpeg");
  const [priceCurve] = useState(PRICE_CURVE.NORMAL);

  const { address } = useAccount();

  const {
    config,
    isError: isErrorPrepare,
    error: errorPrepare,
    isLoading: isLoadingPrepare,
  } = usePrepareContractWrite({
    abi: CURVED_ABI,
    account: address,
    address: process.env.NEXT_PUBLIC_CURVED_ADDRESS as any,
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
  const disabled = isLoading || isError || !write;

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
        title: titleRef.current?.value || "",
        url,
      });
    });
  }, [isSuccessWrite, url]);

  return (
    <div className="mt-4 h-fit w-96 rounded-lg border border-neutral-400 p-4">
      <h3 className="text-center">New Post</h3>

      <form onSubmit={sendTx} className="space-y-2">
        <label className="block">
          <span className="text-neutral-400">Title</span>
          <input
            ref={titleRef}
            disabled={disabled}
            type="text"
            className="w-full rounded border border-neutral-400 bg-neutral-900 px-2"
          />
        </label>

        <label className="block">
          <span className="text-neutral-400">Description</span>
          <textarea
            ref={descriptionRef}
            disabled={disabled}
            className="w-full rounded border border-neutral-400 bg-neutral-900 px-2"
          />
        </label>

        <button
          disabled={disabled}
          type="submit"
          className={`rounded bg-neutral-900 px-2 py-0.5 transition ${
            disabled ? "opacity-50" : "hover:bg-black active:opacity-90"
          }`}
        >
          Submit
        </button>

        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </form>
    </div>
  );
}
