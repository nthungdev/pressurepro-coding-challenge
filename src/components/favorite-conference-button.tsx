import { useMutation } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useTransition } from "react";
import { twMerge } from "tailwind-merge";
import type {
  FavoriteConferenceDeleteResponse,
  FavoriteConferencePostResponse,
} from "@/app/api/conference/types";
import { useConferenceStore } from "@/app/stores/conference-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

async function postFavoriteConference(id: string) {
  const url = `/api/conference/${id}/favorite`;
  const result: FavoriteConferencePostResponse = await fetch(url, {
    method: "POST",
  }).then((r) => r.json());
  return result;
}

async function postUnfavoriteConference(id: string) {
  const url = `/api/conference/${id}/favorite`;
  const result: FavoriteConferenceDeleteResponse = await fetch(url, {
    method: "DELETE",
  }).then((r) => r.json());
  return result;
}

interface FavoriteConferenceButtonProps {
  conferenceId: string;
}

export default function FavoriteConferenceButton({
  conferenceId,
}: FavoriteConferenceButtonProps) {
  const [isPending, transition] = useTransition();
  const favoriteConferenceIds = useConferenceStore(
    (s) => s.favoriteConferenceIds,
  );
  const addFavorite = useConferenceStore((s) => s.addFavorite);
  const removeFavorite = useConferenceStore((s) => s.removeFavorite);

  const isFavorited = favoriteConferenceIds.has(conferenceId);

  const joinMutation = useMutation({
    mutationFn: () => postFavoriteConference(conferenceId),
  });
  const leaveMutation = useMutation({
    mutationFn: () => postUnfavoriteConference(conferenceId),
  });

  function handleFavoriteConference() {
    transition(async () => {
      const result = isFavorited
        ? await leaveMutation.mutateAsync()
        : await joinMutation.mutateAsync();

      if (result.success) {
        isFavorited ? removeFavorite(conferenceId) : addFavorite(conferenceId);
      }
    });
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleFavoriteConference}
      size="lg"
      className={"group inline aspect-square"}
      variant="ghost"
    >
      {isPending && <Spinner />}
      {!isPending && (
        <HeartIcon
          className={twMerge(
            "size-6 text-red-500",
            isFavorited && "fill-red-500",
          )}
        />
      )}
    </Button>
  );
}
