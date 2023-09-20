interface Props {
  params: { id: string };
}

export default function Post({ params }: Props) {
  return <div>Post {params.id}</div>;
}
