"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface DialogContentProps {
  title?: string;
  children: React.ReactNode;
}

export function DialogContent({ title, children }: DialogContentProps) {
  const [mounted, setMounted] = useState(false);

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm transition ${mounted ? "" : "opacity-0"
          }`}
      >
        <Dialog.Content
          className={`mx-2 h-fit max-h-[75%] w-full max-w-xl overflow-y-auto rounded-2xl bg-slate-800 px-8 py-6 shadow-lg transition ${mounted ? "" : "scale-75 opacity-0"
            }`}
        >
          {title ? (
            <h1 className="-mt-2 pb-4 text-center text-xl font-bold">
              {title}
            </h1>
          ) : null}

          {children}
          <Mount setMounted={setMounted} />
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}

function Mount({
  setMounted,
}: {
  setMounted: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [setMounted]);
  return null;
}

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
