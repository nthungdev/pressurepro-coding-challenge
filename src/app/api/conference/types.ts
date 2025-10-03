import type { ApiResponse } from "@/lib/api-response";
import type { conferenceSpeakersTable } from "@/db/schema";

export type ConferenceSpeaker = Omit<
  typeof conferenceSpeakersTable.$inferSelect,
  "conferenceId"
>;
export type Conference = {
  id: string;
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
