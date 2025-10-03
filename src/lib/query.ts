import type { Conference } from "@/app/api/conference/types";
import {
  conferenceSpeakersTable,
  conferencesTable,
  conferenceTagsTable,
  tagsTable,
} from "@/db/schema";
import { db } from "@/lib/drizzle";
import { and, eq, gte, inArray, like, lte } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";
import "server-only";

type ConferenceRow = typeof conferencesTable.$inferSelect;
type ConferenceSpeakerRow = typeof conferenceSpeakersTable.$inferSelect;

type AggregatedConference = ConferenceRow & {
  speakers: Omit<ConferenceSpeakerRow, "conferenceId">[];
  tags: string[];
};

export async function getConferences(options: {
  id?: string | null;
  name?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  tags?: string[] | null;
  page: number;
  pageSize: number;
}) {
  const {
    id,
    name,
    startDate,
    endDate,
    priceFrom,
    priceTo,
    tags,
    page,
    pageSize,
  } = options;

  const conferenceTagNamesQuery = db
    .select()
    .from(conferenceTagsTable)
    .innerJoin(
      tagsTable,
      and(
        eq(conferenceTagsTable.tagId, tagsTable.id),
        tags?.length ? inArray(tagsTable.name, tags) : undefined,
      ),
    )
    .as("conference_tag_names");

  const rows = await withPagination(
    db
      .select()
      .from(conferencesTable)
      .where(
        and(
          id ? eq(conferencesTable.id, id) : undefined,
          name ? like(conferencesTable.name, `%${name}%`) : undefined,
          startDate ? gte(conferencesTable.date, startDate) : undefined,
          endDate ? lte(conferencesTable.date, endDate) : undefined,
          priceFrom
            ? gte(conferencesTable.price, priceFrom.toString())
            : undefined,
          priceTo ? lte(conferencesTable.price, priceTo.toString()) : undefined,
        ),
      )
      .leftJoin(
        conferenceSpeakersTable,
        eq(conferencesTable.id, conferenceSpeakersTable.conferenceId),
      )
      .leftJoin(
        conferenceTagNamesQuery,
        eq(
          conferencesTable.id,
          conferenceTagNamesQuery.conference_tags.conferenceId,
        ),
      )
      .$dynamic(),
    page,
    pageSize,
  );

  // aggregate speakers & tags into each conference
  const result = rows.reduce<Record<string, AggregatedConference>>(
    (acc, row) => {
      const conference = row.conferences;
      const conference_speaker = row.conference_speakers;
      const conference_tag = row.conference_tag_names?.tags;
      if (!acc[conference.id]) {
        acc[conference.id] = { ...conference, speakers: [], tags: [] };
      }
      if (conference_speaker) {
        // take out conferenceId
        const { conferenceId: _, ...speaker } = conference_speaker;
        acc[conference.id].speakers.push(speaker);
      }
      if (conference_tag) {
        const { name } = conference_tag;
        // name could be null despite infered type
        if (name) acc[conference.id].tags.push(name);
      }
      return acc;
    },
    {},
  );

  const conferences = Object.values(result).map(formatConference);
  return conferences;
}

/**
 * Add pagination to select queries. Need to convert the query to dynamic.
 * ```
 * const query = db.select().from(conferencesTable)
 * withPagination(query.$dynamic(), page, pageSize);
 * ```
 */
export function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

/**
 * Format queried conference row to conference object
 */
export function formatConference(conference: AggregatedConference): Conference {
  return {
    ...conference,
    speakers: conference.speakers,
    tags: conference.tags,
    price: Number(conference.price),
  };
}
