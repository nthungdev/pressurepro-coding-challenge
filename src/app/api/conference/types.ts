import { createConferenceSchema } from "@/app/api/conference/schemas";
import type { ApiResponse } from "@/lib/api-response";
import type z from "zod";

export type ConferencePostResponseData = z.infer<
  typeof createConferenceSchema
> & { id: string };

export type ConferencePostResponse = ApiResponse<ConferencePostResponseData>;

export type ConferenceTagsPutResponseData = {
  addCount: number;
  deleteCount: number;
};
