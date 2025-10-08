"use client";

import { useEffect } from "react";
import { useConferenceStore } from "@/app/stores/conference-store";

type Props = {
  joinedIds: string[];
  favoriteIds: string[];
  children: React.ReactNode;
};

export default function ConferenceProvider({
  joinedIds,
  favoriteIds,
  children,
}: Props) {
  const setFavoriteConferences = useConferenceStore(
    (s) => s.setFavoriteConferences,
  );
  const setJoinedConferences = useConferenceStore(
    (s) => s.setJoinedConferences,
  );

  useEffect(() => {
    setFavoriteConferences(favoriteIds);
    setJoinedConferences(joinedIds);
  }, [joinedIds, favoriteIds, setFavoriteConferences, setJoinedConferences]);

  return <>{children}</>;
}
