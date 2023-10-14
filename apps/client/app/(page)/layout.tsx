import { AppTitle } from "../AppTitle";
import { BackButton } from "./BackButton";

interface Props {
  children: React.ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <>
      <div className="h-11 md:hidden" />

      <div className="fixed inset-x-0 top-0 z-50 grid grid-cols-3 bg-slate-800 p-2 shadow md:hidden">
        <div className="flex items-center">
          <BackButton />
        </div>

        <div className="flex items-center justify-center">
          <AppTitle />
        </div>
      </div>

      {children}
    </>
  );
}
