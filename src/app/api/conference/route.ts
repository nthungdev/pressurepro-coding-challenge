import { createConferenceSchema } from "@/app/api/conference/schemas";
import type {
  ConferenceGetResponseData,
  ConferencePostResponseData,
} from "@/app/api/conference/types";
import { conferencesTable } from "@/db/schema";
import { createSuccessResponse } from "@/lib/api-response";
import {
  withAuthenticatedRequired,
  withBodyValidator,
  withErrorHandling,
} from "@/lib/api-utils";
import { parseIsoDate, parseNumber, serializeConference } from "@/lib/data";
import { db } from "@/lib/drizzle";
import { formatConference, getConferences } from "@/lib/query";

const DEFAULT_PAGE_SIZE = 20;

// Get a list of conferences
export const GET = withErrorHandling(async (request) => {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);
  const name = searchParams.get("name") ?? undefined;
  const startDate =
    parseIsoDate(searchParams.get("startDate") ?? "") ?? undefined;
  const endDate = parseIsoDate(searchParams.get("endDate") ?? "") ?? undefined;
  const priceFrom = parseNumber(searchParams.get("priceFrom")) ?? undefined;
  const priceTo = parseNumber(searchParams.get("priceTo")) ?? undefined;
  const tags = searchParams
    .get("tags")
    ?.split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");
  const ownerId = searchParams.get("ownerId") ?? undefined;

  const conferences = await getConferences({
    name,
    startDate,
    endDate,
    priceFrom,
    priceTo,
    tags,
    page,
    pageSize,
    ownerId,
  });
  return createSuccessResponse<ConferenceGetResponseData>({
    count: conferences.length,
    conferences: conferences.map(formatConference).map(serializeConference),
  });
});

// Create a new conference
export const POST = withErrorHandling(
  withAuthenticatedRequired((session) =>
    withBodyValidator(createConferenceSchema, (data) => async () => {
      const insertConferenceResult = await db
        .insert(conferencesTable)
        .values({
          ownerId: session.userId,
          name: data.name,
          location: data.location,
          description: data.description,
          maxAttendees: data.maxAttendees,
          price: data.price.toString(),
          date: new Date(data.date),
          isFeatured: data.isFeatured,
        })
        .returning();

      const conferenceRecord = insertConferenceResult?.[0];
      const conference = formatConference({
        ...conferenceRecord,
        tags: [],
        speakers: [],
      });

      return createSuccessResponse<ConferencePostResponseData>(conference);
    }),
  ),
);
