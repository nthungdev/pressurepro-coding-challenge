import type { conferenceSpeakersTable } from "@/db/schema";
import type { ApiResponse } from "@/lib/api-response";

export type ConferenceSpeaker = Omit<
  typeof conferenceSpeakersTable.$inferSelect,
  "conferenceId"
>;
export type Conference = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  location: string;
  price: number;
  maxAttendees: number;
  isFeatured: boolean;
  speakers: ConferenceSpeaker[];
  tags: string[];
  date: Date;
};

export type ConferencePostResponseData = Conference;

export type ConferencePostResponse = ApiResponse<ConferencePostResponseData>;

export type ConferenceTagsPutResponseData = {
  addCount: number;
  deleteCount: number;
};

export type SerializedConference = Omit<Conference, "date"> & { date: string };

export type ConferenceGetResponseData = {
  count: number;
  conferences: SerializedConference[];
};

export type ConferenceGetResponse = ApiResponse<ConferenceGetResponseData>;

export type ConferenceByIdGetResponseData = {
  conference: SerializedConference | null;
};

export type ConferenceByIdGetResponse =
  ApiResponse<ConferenceByIdGetResponseData>;

export type JoinConferencePostResponse = ApiResponse<undefined>;
export type JoinConferenceDeleteResponse = ApiResponse<undefined>;

export type FavoriteConferencePostResponse = ApiResponse<undefined>;
export type FavoriteConferenceDeleteResponse = ApiResponse<undefined>;
