import Overlay from "./Overlay";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <Overlay>{children}</Overlay>;
}
