import type { ApiResponse } from "@/lib/api-response";

export type FavoriteConferencesGetData = {
  favoriteConferences: {
    id: string;
  }[];
};

export type FavoriteConferencesGetResponse =
  ApiResponse<FavoriteConferencesGetData>;
