import { AppTitle } from "../AppTitle";
import { BackButton } from "./BackButton";

interface Props {
  children: React.ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <div>
      <div className="grid grid-cols-3 px-3 py-2 shadow">
        <div className="flex items-center">
          <BackButton />
        </div>

        <div className="flex items-center justify-center">
          <AppTitle />
        </div>
      </div>

      {children}
    </div>
  );
}
