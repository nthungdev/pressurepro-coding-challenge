export type ConferenceFilters = {
  tags?: string[];
  name?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  priceRange?: [number, number];
  ownerId?: string;
};
