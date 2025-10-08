import { useMutation } from "@tanstack/react-query";
import { useTransition } from "react";
import { twMerge } from "tailwind-merge";
import type {
  JoinConferenceDeleteResponse,
  JoinConferencePostResponse,
} from "@/app/api/conference/types";
import { useConferenceStore } from "@/app/stores/conference-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

async function postJoinConference(id: string) {
  const url = `/api/conference/${id}/join`;
  const result: JoinConferencePostResponse = await fetch(url, {
    method: "POST",
  }).then((r) => r.json());
  return result;
}

async function postLeaveConference(id: string) {
  const url = `/api/conference/${id}/join`;
  const result: JoinConferenceDeleteResponse = await fetch(url, {
    method: "DELETE",
  }).then((r) => r.json());
  return result;
}

interface JoinConferenceButtonProps {
  conferenceId: string;
}

export default function JoinConferenceButton({
  conferenceId,
}: JoinConferenceButtonProps) {
  const [isPending, transition] = useTransition();
  const joinedConferenceIds = useConferenceStore((s) => s.joinedConferenceIds);
  const joinConference = useConferenceStore((s) => s.joinConference);
  const leaveConference = useConferenceStore((s) => s.leaveConference);

  const hasJoined = joinedConferenceIds.has(conferenceId);

  const label = hasJoined ? "Joined" : "Join";
  const labelOnHover = hasJoined ? "Leave" : "Join";

  const joinMutation = useMutation({
    mutationFn: () => postJoinConference(conferenceId),
  });
  const leaveMutation = useMutation({
    mutationFn: () => postLeaveConference(conferenceId),
  });

  function handleJoinConference() {
    transition(async () => {
      const result = hasJoined
        ? await leaveMutation.mutateAsync()
        : await joinMutation.mutateAsync();

      if (result.success) {
        hasJoined
          ? leaveConference(conferenceId)
          : joinConference(conferenceId);
      }
    });
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleJoinConference}
      className={twMerge("w-full group", hasJoined && "hover:bg-destructive")}
      variant="secondary"
    >
      {isPending && <Spinner />}
      {!isPending && (
        <>
          <span className="group-hover:hidden font-bold text-lg">{label}</span>
          <span className="hidden group-hover:inline font-bold text-lg">
            {isPending ? <Spinner /> : labelOnHover}
          </span>
        </>
      )}
    </Button>
  );
}
