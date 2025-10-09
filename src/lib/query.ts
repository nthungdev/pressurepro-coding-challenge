import { and, desc, eq, gte, inArray, like, lte } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";
import type { Conference } from "@/app/api/conference/types";
import {
  conferenceSpeakersTable,
  conferencesTable,
  conferenceTagsTable,
  tagsTable,
  userFavoriteConferencesTable,
  userJoinConferencesTable,
} from "@/db/schema";

import { db } from "@/lib/drizzle";
import "server-only";

type ConferenceRow = typeof conferencesTable.$inferSelect;
type ConferenceSpeakerRow = typeof conferenceSpeakersTable.$inferSelect;

type AggregatedConference = ConferenceRow & {
  speakers: ConferenceSpeakerRow[];
  tags: string[];
};

export async function getConferences(options: {
  page: number;
  pageSize: number;
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  priceFrom?: number;
  priceTo?: number;
  tags?: string[];
  ownerId?: string;
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
    ownerId,
  } = options;

  const conferenceQuery = withPagination(
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
          ownerId ? eq(conferencesTable.ownerId, ownerId) : undefined,
        ),
      )
      .$dynamic(),
    page,
    pageSize,
  ).as("conferences");

  const matchedTagsQuery = db
    .select({
      conferenceId: conferenceTagsTable.conferenceId,
    })
    .from(conferenceTagsTable)
    .innerJoin(tagsTable, eq(conferenceTagsTable.tagId, tagsTable.id))
    .where(tags?.length ? inArray(tagsTable.name, tags) : undefined)
    .as("matched_tags");

  const rows = await db
    .select()
    .from(conferenceQuery)
    .leftJoin(
      conferenceSpeakersTable,
      eq(conferenceQuery.id, conferenceSpeakersTable.conferenceId),
    )
    .leftJoin(
      conferenceTagsTable,
      eq(conferenceQuery.id, conferenceTagsTable.conferenceId),
    )
    .leftJoin(tagsTable, eq(tagsTable.id, conferenceTagsTable.tagId))
    .where(
      // Apply tag filter only if tags exist
      tags?.length
        ? inArray(
            conferencesTable.id,
            db
              .select({ id: matchedTagsQuery.conferenceId })
              .from(matchedTagsQuery),
          )
        : undefined,
    )
    .orderBy(desc(conferencesTable.date));

  // aggregate speakers & tags into each conference
  const result = rows.reduce<Record<string, AggregatedConference>>(
    (acc, row) => {
      const conference = row.conferences;
      const conference_speaker = row.conference_speakers;
      const tagName = row.tags?.name;

      // skip row has no tag when we're filtering by tags
      if (tags?.length && tagName === undefined) return acc;

      if (!acc[conference.id]) {
        acc[conference.id] = { ...conference, speakers: [], tags: [] };
      }
      if (
        conference_speaker &&
        acc[conference.id].speakers.every((s) => s.id !== conference_speaker.id)
      ) {
        acc[conference.id].speakers.push(conference_speaker);
      }
      if (tagName && acc[conference.id].tags.every((t) => t !== tagName)) {
        acc[conference.id].tags.push(tagName);
      }
      return acc;
    },
    {},
  );

  const conferences = Object.values(result);
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

export async function getJoinedConferences(userId: string) {
  const result = await db
    .select()
    .from(userJoinConferencesTable)
    .where(eq(userJoinConferencesTable.userId, userId));

  return result.map((r) => ({ id: r.conferenceId }));
}

export async function getFavoriteConferences(userId: string) {
  const result = await db
    .select()
    .from(userFavoriteConferencesTable)
    .where(eq(userFavoriteConferencesTable.userId, userId));

  return result.map((r) => ({ id: r.conferenceId }));
}
