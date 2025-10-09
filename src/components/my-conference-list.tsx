"use client";

import ConferenceList from "@/components/conference-list";
import useUser from "@/hooks/useUser";

export default function MyConferenceList() {
  const user = useUser();
  return <ConferenceList filters={{ ownerId: user?.id }} />;
}
