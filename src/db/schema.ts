import {
  boolean,
  decimal,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
});

export const conferencesTable = pgTable("conferences", {
  id: uuid().primaryKey().defaultRandom(),
  ownerId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
  location: varchar({ length: 255 }).notNull(),
  price: decimal().notNull(),
  imageUrl: varchar(),
  maxAttendees: integer().notNull(),
  isFeatured: boolean().default(false).notNull(),
});

export const conferenceSpeakersTable = pgTable("conference_speakers", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  company: varchar({ length: 255 }).notNull(),
  bio: text().notNull(),
  avatarUrl: varchar(),
  conferenceId: uuid()
    .references(() => conferencesTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const userFavoriteConferencesTable = pgTable(
  "user_favorite_conferences",
  {
    userId: uuid()
      .references(() => usersTable.id)
      .notNull(),
    conferenceId: uuid()
      .references(() => conferencesTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.conferenceId] })],
);

export const conferenceTagsTable = pgTable(
  "conference_tags",
  {
    conferenceId: uuid()
      .references(() => conferencesTable.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid()
      .references(() => tagsTable.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.conferenceId, table.tagId] })],
);

export const tagsTable = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull().unique(),
});
