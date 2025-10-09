# PressurePro Coding Challenge

Tech Stacks:

- Next.js
- TailwindCSS
- Neon + drizzle: PostgreSQL and ORM
- Biome: lint and formatting

## Get Started

```sh
pnpm install
pnpm dev
```

## Scripts

Apply database schemas changes

```sh
npx drizzle-kit push
```

## Documentation

Progress: since I'm less relying on vibe coding, there are still many features that I haven't touched on. But I the code organization and abstraction I did for the available features are well appreciated.

### UX

- I decided to separate mutations of a conference' speakers, tags, favorite, and join because that would make implementation of forms and validation easier.

### Tables

- users
- conferences
- conference_speakers
- user_join_conferences
- user_favorite_conferences
- tags
- conference_tags

Comments

- I normalized conference_tags and tags so that it's easier retrieve all unique tags. We can potentially use different tags as filter presets or assign to users or speakers.
- 3 tables conference_speakers, user_join_conferences, and user_favorite_conferences are simply weak relationship tables.
- I don't keep conference speakers as a separate table because speakers don't exist anywhere besides as a "conference information". However, if there is a potential need for features like: top speakers, then we might need to set it as a separate table, but we need more requirement on speakers management as speakers need to be created separate from the conferences.

## Technologies

- TailwindCSS: I'm most comfortable with this library, I like it because of it's flexibility and being unopinionated.
- PostgreSQL: I choose SQL because there is a requirement on different fitlers and search. It's easier to implement complex queries with SQL than NoSQL. I chose this particular RDBMS because of familiarity and its popularity.
- Drizzle: I chose to rely on ORM instead of writing plain SQL so that I can get typings.
- NeonDB: to host PostgreSQL for free.
