import { notFound } from "next/navigation";
import UpdateConferencePage from "@/app/admin/conference/[id]/update/update-conference-page";
import { NO_PERMISSION } from "@/lib/error-messages";
import { getConferences } from "@/lib/query";
import { verifySession } from "@/lib/session";

export default async function ({
  params,
}: PageProps<"/admin/conference/[id]/update">) {
  const { id } = await params;

  const conferences = await getConferences({ page: 1, pageSize: 1, id });
  const conference = conferences?.[0];

  if (!conference) {
    notFound();
  }

  const session = await verifySession();

  if (conference.ownerId !== session.userId) {
    throw new Error(NO_PERMISSION);
  }

  return <UpdateConferencePage conference={conference} />;
}
