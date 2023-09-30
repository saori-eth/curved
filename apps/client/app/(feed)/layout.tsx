interface Props {
  children: React.ReactNode;
}

export default function FeedLayout({ children }: Props) {
  return (
    <>
      <div className="fixed inset-x-0 top-0 flex justify-center">
        <button>hi</button>
      </div>

      {children}
    </>
  );
}
