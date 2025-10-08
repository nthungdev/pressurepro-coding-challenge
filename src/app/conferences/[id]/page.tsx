export default async function ConferencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>TODO Conference Page {id}</div>;
}
