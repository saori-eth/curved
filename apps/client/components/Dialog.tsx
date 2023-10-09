"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

interface DialogContentProps {
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function DialogContent({
  title,
  disabled,
  children,
}: DialogContentProps) {
  const [mounted, setMounted] = useState(false);

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm transition ${mounted ? "" : "opacity-0"
          }`}
      >
        <Dialog.Content
          className={`mx-2 h-fit max-h-[85%] w-full max-w-xl overflow-y-auto rounded-2xl bg-slate-800 p-4 shadow-lg transition md:py-5 ${mounted ? "" : "scale-75 opacity-0"
            }`}
        >
          <div className="grid grid-cols-3 md:px-5 md:pb-4">
            <div />

            {title ? (
              <h1 className="text-center text-xl font-bold">{title}</h1>
            ) : null}

            <div className="flex items-center justify-end">
              <Dialog.Close
                title="Close"
                className={`rounded-full text-slate-500 transition ${disabled
                    ? "cursor-default opacity-50"
                    : "hover:bg-slate-700 hover:text-slate-200 active:scale-95"
                  }`}
              >
                <IoIosClose className="text-3xl" />
              </Dialog.Close>
            </div>
          </div>

          <div className="md:px-8">{children}</div>

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
