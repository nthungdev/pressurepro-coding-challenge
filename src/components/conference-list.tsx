"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ConferenceCard from "@/components/conference-card";
import { Spinner } from "@/components/ui/spinner";
import { deserializeConference } from "@/lib/data";
import { fetchConferences } from "@/lib/fetches";
import type { ConferenceFilters } from "@/lib/ui-types";

const PAGE_SIZE = 10;

interface ConferenceListProps {
  filters?: ConferenceFilters;
}

export default function ConferenceList({ filters = {} }: ConferenceListProps) {
  const [fetchedAll, setFetchedAll] = useState(false);
  const [page, _] = useState(1);
  const { ref, inView } = useInView();
  const { data, error, isPending, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["conferences", page, filters],
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        fetchConferences(pageParam, PAGE_SIZE, { ...filters }),
      getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
    });

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchedAll should not be watched
  useEffect(() => {
    async function fetchMore() {
      const { data } = await fetchNextPage();
      if (data) {
        const lastGroup = data.pages.at(data.pages.length - 1);
        if (lastGroup?.success) {
          if (lastGroup.data.count === 0) {
            console.log("reach end");
            setFetchedAll(true);
          }
        }
      }
    }

    if (inView && !fetchedAll) {
      fetchMore();
    }
  }, [inView, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    throw error;
  }

  const combined = isPending
    ? []
    : data.pages.flatMap((group) =>
        group.success ? group.data.conferences : [],
      );

  const conferences = combined.map(deserializeConference);

  return (
    <div>
      <ul className="space-y-4 mt-4">
        {conferences.map((conference) => (
          <li key={conference.id}>
            <ConferenceCard conference={conference} />
          </li>
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner className="size-8" />
          </div>
        )}
        <div ref={ref}></div>
      </ul>
    </div>
  );
}
