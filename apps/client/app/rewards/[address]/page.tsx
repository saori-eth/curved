import { notFound } from "next/navigation";

import { RewardsPage } from "./RewardsPage";

import { fetchProfile } from "@/lib/fetchProfile";

export const revalidate = 30;

interface Props {
  params: { address: string };
}

export default async function Post({ params }: Props) {
  const user = await fetchProfile(params.address.toLowerCase());
  if (!user) {
    notFound();
  }

  return (
    <div className="flex w-full justify-center pt-20">
      <div className="w-full max-w-5xl">
        <RewardsPage user={user} />
      </div>
    </div>
  );
}
