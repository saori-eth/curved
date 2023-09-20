interface Props {
  params: { id: string };
}

export default function Post({ params }: Props) {
  return (
    <div className="mx-4 flex h-screen items-center justify-center">
      <div className="h-2/3 w-full max-w-6xl rounded-2xl bg-neutral-800 p-8 shadow-xl">
        <div>Dialog {params.id}</div>
      </div>
    </div>
  );
}
