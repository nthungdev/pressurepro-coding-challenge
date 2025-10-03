import { conferenceSpeakersTable, conferencesTable } from "@/db/schema";
import type { ConferencePostResponseData } from "@/app/api/conference/types";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { db } from "@/lib/drizzle";
import { INTERNAL } from "@/lib/error-messages";
import { withBodyValidator, withPagination } from "@/lib/api-utils";
import { createConferenceSchema } from "@/app/api/conference/schemas";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 20;

type Conference = typeof conferencesTable.$inferSelect;
type ConferenceSpeaker = typeof conferenceSpeakersTable.$inferSelect;

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE);

  try {
    const query = db
      .select()
      .from(conferencesTable)
      .leftJoin(
        conferenceSpeakersTable,
        eq(conferencesTable.id, conferenceSpeakersTable.conferenceId),
      );

    const rows = await withPagination(query.$dynamic(), page, pageSize);
    // aggregate speakers into each conference
    const result = rows.reduce<
      Record<
        string,
        Conference & { speakers: Omit<ConferenceSpeaker, "conferenceId">[] }
      >
    >((acc, row) => {
      const conference = row.conferences;
      const conference_speaker = row.conference_speakers;
      if (!acc[conference.id]) {
        acc[conference.id] = { ...conference, speakers: [] };
      }
      if (conference_speaker) {
        // take out conferenceId
        const { conferenceId: _, ...speaker } = conference_speaker;
        acc[conference.id].speakers.push(speaker);
      }
      return acc;
    }, {});

    return createSuccessResponse(result);
  } catch (error) {
    console.error(error);
    return createErrorResponse({ message: INTERNAL }, 500);
  }
};

export const POST = withBodyValidator(
  createConferenceSchema,
  async (data, _) => {
    try {
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
      if (!conferenceRecord) {
        return createErrorResponse({ message: INTERNAL }, 500);
      }

      return createSuccessResponse<ConferencePostResponseData>({
        ...data,
        id: conferenceRecord.id,
      });
    } catch (error) {
      console.error(error);
      return createErrorResponse({ message: INTERNAL }, 500);
    }
  },
);
