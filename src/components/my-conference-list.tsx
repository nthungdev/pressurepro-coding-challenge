"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ConferenceGetResponse } from "@/app/api/conference/types";
import ConferenceCard from "@/components/confernce-card";
import useUser from "@/hooks/useUser";
import { deserializeConference } from "@/lib/data";

const PAGE_SIZE = 10;

async function fetchConferences(
  page: number,
  pageSize: number,
  userId?: string,
) {
  const url = new URL("/api/conference", window.location.origin);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("pageSize", pageSize.toString());
  if (userId) url.searchParams.set("ownerId", userId);
  const response: ConferenceGetResponse = await fetch(url).then((r) =>
    r.json(),
  );
  return response;
}

// TODO implement pagination/infinite loading
export default function MyConferenceList() {
  const user = useUser();
  const [page, _] = useState(1);
  const { data, error, isPending } = useQuery({
    queryKey: ["conferences", page, user?.id],
    queryFn: () => fetchConferences(page, PAGE_SIZE, user?.id),
  });

  if (!user) {
    return <div>Not Authenticated</div>;
  }

  if (isPending) {
    // TODO make it pretty
    return <div>Loading</div>;
  }

  if (error || data.success === false) {
    // TODO make it pretty
    return <div>Error</div>;
  }

  const conferences = data.data.conferences.map(deserializeConference);

  return (
    <ul className="space-y-4">
      {conferences.map((conference) => (
        <li key={conference.id}>
          <ConferenceCard conference={conference} />
        </li>
      ))}
    </ul>
  );
}
