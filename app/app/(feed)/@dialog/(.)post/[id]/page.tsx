interface Props {
  params: { id: string };
}

export default function Post({ params }: Props) {
  return (
    <div className="h-full w-full max-w-6xl rounded-2xl bg-neutral-800 p-8 shadow-xl">
      <div>Dialog {params.id}</div>
    </div>
  );
}
