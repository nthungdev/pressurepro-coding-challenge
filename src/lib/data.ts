import { Conference, SerializedConference } from "@/app/api/conference/types";

export function parseIsoDate(dateString: string): Date | null {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    // invalid date
    return null;
  }
  return date;
}

export function parseNumber(str: string | undefined | null): number | null {
  if (str == null) return null;

  const num = Number(str);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return null;
  }

  return num;
}

export function serializeConference(
  conference: Conference,
): SerializedConference {
  return {
    ...conference,
    date: conference.date.toISOString(),
  };
}

export function deserializeConference(
  serializedConference: SerializedConference,
): Conference {
  return {
    ...serializedConference,
    date: new Date(serializedConference.date),
  };
}
