import type z from "zod";
import type {
  setTagsSchema,
  updateConferenceSchema,
  updateSpeakerSchema,
} from "@/app/api/conference/schemas";
import type {
  ConferenceByIdGetResponse,
  ConferenceGetResponse,
  ConferenceSpeakerPostResponse,
} from "@/app/api/conference/types";
import type { ApiResponse } from "@/lib/api-response";
import type { ConferenceFilters } from "@/lib/ui-types";

export type UpdateConferenceFormData = z.infer<typeof updateConferenceSchema>;

export async function fetchConferences(
  page: number,
  pageSize: number,
  options: Partial<ConferenceFilters>,
) {
  const url = new URL("/api/conference", window.location.origin);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("pageSize", pageSize.toString());

  const [priceFrom, priceTo] = options.priceRange ?? [];
  if (options.ownerId) url.searchParams.set("ownerId", options.ownerId);
  if (options.name) url.searchParams.set("name", options.name);
  if (options.startDate)
    url.searchParams.set("startDate", options.startDate.toISOString());
  if (options.endDate)
    url.searchParams.set("endDate", options.endDate.toISOString());
  if (priceFrom) url.searchParams.set("priceFrom", priceFrom.toString());
  if (priceTo) url.searchParams.set("priceTo", priceTo.toString());
  if (options.tags) url.searchParams.set("tags", options.tags.join(","));

  const response: ConferenceGetResponse = await fetch(url).then((r) =>
    r.json(),
  );
  return response;
}

export async function fetchConferenceById(id: string) {
  const url = new URL(`/api/conference/${id}`, window.location.origin);
  const response: ConferenceByIdGetResponse = await fetch(url).then((r) =>
    r.json(),
  );
  return response;
}

export async function updateConference(
  id: string,
  data: UpdateConferenceFormData,
) {
  const url = `/api/conference/${id}`;
  const response: ApiResponse<undefined> = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then((r) => r.json());
  return response;
}

export async function setConferenceTags(
  conferenceId: string,
  data: z.infer<typeof setTagsSchema>,
) {
  const url = `/api/conference/${conferenceId}/tags`;
  const response: ApiResponse<undefined> = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then((r) => r.json());
  return response;
}

export async function updateConferenceSpeaker(
  conferenceId: string,
  speakerId: string,
  data: z.infer<typeof updateSpeakerSchema>,
) {
  const url = `/api/conference/${conferenceId}/speaker/${speakerId}`;
  const response: ConferenceSpeakerPostResponse = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then((r) => r.json());
  return response;
}

export async function removeConferenceSpeaker(
  conferenceId: string,
  speakerId: string,
) {
  const url = `/api/conference/${conferenceId}/speaker/${speakerId}`;
  const response: ConferenceSpeakerPostResponse = await fetch(url, {
    method: "DELETE",
  }).then((r) => r.json());
  return response;
}
