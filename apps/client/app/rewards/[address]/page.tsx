import { notFound } from "next/navigation";

import { fetchProfileFromAddress } from "@/lib/fetchProfile";

import { RewardsPage } from "./RewardsPage";

export const revalidate = 30;

interface Props {
  params: { address: string };
}

export default async function Post({ params }: Props) {
  const user = await fetchProfileFromAddress(params.address.toLowerCase());
  if (!user) {
    notFound();
  }

  return (
    <div className="flex w-full justify-center pt-20">
      <div className="max-w-content w-full">
        <RewardsPage user={user} />
      </div>
    </div>
  );
}
