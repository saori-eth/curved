import { getSession } from "@/lib/auth/getSession";

import { Royalties } from "./Royalties";
import { Yuyu } from "./Yuyu";

export default async function Rewards() {
  const session = await getSession();

  return (
    <div className="z-20 col-span-3 mx-4 space-y-4 pt-8 md:pt-2">
      <h1 className="text-center text-5xl">🎁</h1>

      <div className="flex items-center justify-center">
        <p className="text-center text-slate-400">
          Creators earn <span className="font-semibold text-white">ETH</span>{" "}
          royalties.
          <br />
          Users earn <span className="font-semibold text-white">YUYU</span>{" "}
          rewards based on their trading volume.
        </p>
      </div>

      {session ? (
        <>
          <Royalties address={session.user.address} />
          <Yuyu address={session.user.address} />
        </>
      ) : (
        <p className="text-center text-slate-400">
          You must be logged in to view your rewards.
        </p>
      )}
    </div>
  );
}
