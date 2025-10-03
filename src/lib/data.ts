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
