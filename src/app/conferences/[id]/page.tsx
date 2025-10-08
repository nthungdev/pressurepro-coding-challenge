"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import type { ConferenceByIdGetResponse } from "@/app/api/conference/types";
import JoinConferenceButton from "@/components/join-conference-button";
import { deserializeConference, formatDate, formatPrice } from "@/lib/data";

async function fetchConferenceById(id: string) {
  const url = new URL(`/api/conference/${id}`, window.location.origin);
  const response: ConferenceByIdGetResponse = await fetch(url).then((r) =>
    r.json(),
  );
  return response;
}

export default function ConferencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, error, isPending } = useQuery({
    queryKey: ["fetchConferenceById", id],
    queryFn: () => fetchConferenceById(id),
  });

  if (isPending) {
    // TODO make it pretty
    return <div>Loading</div>;
  }

  if (error) {
    // TODO make it pretty
    console.log({ error });
    return <div>Error</div>;
  }

  if (!data.success) {
    // TODO make it pretty
    return (
      <div>
        <h1>Error</h1>
        <p>{data.error.message}</p>
      </div>
    );
  }

  const conference =
    data.data.conference && deserializeConference(data.data.conference);

  if (!conference) {
    notFound();
  }

  const formattedDate = formatDate(conference.date, "date");
  const formattedDateFull = formatDate(conference.date);
  const formattedPrice = formatPrice(conference.price);

  return (
    <div>
      <Image
        className="w-full"
        width={1500}
        height={1000}
        alt=""
        src="https://assets.superblog.ai/site_cuid_cljwev9k51068503tp9cdl2howu/images/thumbnail-1-1708502143662-compressed.png"
      />

      <div className="h-full overflow-y-auto relative md:max-w-5xl mx-auto flex flex-col md:flex-row px-4">
        <div className="pt-4 pb-80 md:pt-8 md:pb-40 md:w-3/5 space-y-4 md:space-y-8">
          <div className="text-lg md:text-xl text-gray-600">
            {formattedDate}
          </div>

          <h1 className="text-2xl md:text-5xl font-bold">{conference.name}</h1>

          <div>
            <h2 className="text-xl mdtext-2xl font-semibold mb-2">
              Date and time
            </h2>
            <div>{formattedDateFull}</div>
          </div>

          <div>
            <h2 className="text-xl mdtext-2xl font-semibold mb-2">Location</h2>
            <div>{conference.location}</div>
          </div>

          <div>
            <h2 className="text-xl mdtext-2xl font-semibold mb-2">
              About this conference
            </h2>
            <p className="text-gray-600">{conference.description}</p>
          </div>

          {conference.tags.length !== 0 && (
            <div>
              <h2 className="text-xl mdtext-2xl font-semibold mb-2">Tags</h2>
              <ul className="flex flex-row flex-wrap gap-4">
                {conference.tags.map((tag) => (
                  <span className="px-2 py-1" key={tag}>
                    {tag}
                  </span>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 fixed md:relative top-0 left-0 size-full">
          <div className="w-full absolute md:sticky bottom-0 md:top-0 right-0 pt-8 md:py-8">
            <div className="md:max-w-sm bg-white p-8 text-center border rounded-xl space-y-4">
              <div className="text-3xl">{formattedPrice}</div>
              <JoinConferenceButton conferenceId={conference.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
