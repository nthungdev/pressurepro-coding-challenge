import type { ConferencePostResponseData } from "@/app/api/conference/types";
import { createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { withBodyValidator, withErrorHandling } from "@/lib/api-utils";
import { createConferenceSchema } from "@/app/api/conference/schemas";
import type { NextRequest } from "next/server";
import { parseIsoDate, parseNumber } from "@/lib/data";
import { formatConference, getConferences } from "@/lib/query";
import { conferencesTable } from "@/db/schema";

const DEFAULT_PAGE_SIZE = 20;

// Get a list of conferences
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);
  const name = searchParams.get("name");
  const startDate = parseIsoDate(searchParams.get("startDate") ?? "");
  const endDate = parseIsoDate(searchParams.get("endDate") ?? "");
  const priceFrom = parseNumber(searchParams.get("priceFrom"));
  const priceTo = parseNumber(searchParams.get("priceTo"));
  const tags = searchParams
    .get("tags")
    ?.split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  const conferences = await getConferences({
    name,
    startDate,
    endDate,
    priceFrom,
    priceTo,
    tags,
    page,
    pageSize,
  });
  return createSuccessResponse({
    count: conferences.length,
    conferences,
  });
});

// Create a new conference
export const POST = withErrorHandling(
  withBodyValidator(createConferenceSchema, async (data, _) => {
    const insertConferenceResult = await db
      .insert(conferencesTable)
      .values({
        name: data.name,
        location: data.location,
        description: data.description,
        maxAttendees: data.maxAttendees,
        price: data.price.toString(),
        date: new Date(data.date),
        isFeatured: data.isFeatured,
      })
      .onConflictDoNothing()
      .returning();

    const conferenceRecord = insertConferenceResult?.[0];
    const conference = formatConference({
      ...conferenceRecord,
      tags: [],
      speakers: [],
    });

    return createSuccessResponse<ConferencePostResponseData>(conference);
  }),
);
