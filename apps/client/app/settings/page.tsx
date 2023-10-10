import { getSession } from "@/lib/auth/getSession";

export default async function Setting() {
  const session = await getSession();
  if (!session) {
    return (
      <p className="z-20 col-span-3 pt-2 text-center text-slate-400">
        You must be logged in to view this page.
      </p>
    );
  }

  return (
    <div className="z-20 col-span-3 w-full space-y-2 pt-4 md:pt-2">
      <h1 className="text-center text-2xl font-bold">Settings</h1>
    </div>
  );
}
