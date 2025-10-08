import { create } from "zustand";

type ConferenceStore = {
  joinedConferenceIds: Set<string>;
  favoriteConferenceIds: Set<string>;
  joinConference: (id: string) => void;
  leaveConference: (id: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  setJoinedConferences: (ids: string[]) => void;
  setFavoriteConferences: (ids: string[]) => void;
  isJoined: (id: string) => boolean;
  isFavorited: (id: string) => boolean;
};

export const useConferenceStore = create<ConferenceStore>((set, get) => ({
  joinedConferenceIds: new Set(),
  favoriteConferenceIds: new Set(),

  joinConference: (id) =>
    set((state) => ({
      joinedConferenceIds: new Set(state.joinedConferenceIds).add(id),
    })),

  leaveConference: (id) =>
    set((state) => {
      const updated = new Set(state.joinedConferenceIds);
      updated.delete(id);
      return { joinedConferenceIds: updated };
    }),

  addFavorite: (id) =>
    set((state) => ({
      favoriteConferenceIds: new Set(state.favoriteConferenceIds).add(id),
    })),

  removeFavorite: (id) =>
    set((state) => {
      const updated = new Set(state.favoriteConferenceIds);
      updated.delete(id);
      return { favoriteConferenceIds: updated };
    }),

  setJoinedConferences: (ids) =>
    set(() => ({ joinedConferenceIds: new Set(ids) })),

  setFavoriteConferences: (ids) =>
    set(() => ({ favoriteConferenceIds: new Set(ids) })),

  isJoined: (id) => get().joinedConferenceIds.has(id),
  isFavorited: (id) => get().favoriteConferenceIds.has(id),
}));
