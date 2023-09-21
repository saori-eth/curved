interface Props {
  children: React.ReactNode;
  dialog: React.ReactNode;
}

export default function FeedLayout({ children, dialog }: Props) {
  return (
    <>
      {children}
      {dialog}
    </>
  );
}
