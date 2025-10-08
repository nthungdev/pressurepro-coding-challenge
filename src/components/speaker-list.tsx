import type { ConferenceSpeaker } from "@/app/api/conference/types";
import EditSpeakerDialog from "@/components/edit-speaker-dialog";

export interface SpeakerListProps {
  speakers: ConferenceSpeaker[];
  showEditButton?: boolean;
  onRemoved?: (speaker: ConferenceSpeaker) => void;
  onEdited?: (speaker: ConferenceSpeaker) => void;
}

export default function SpeakerList({
  speakers,
  showEditButton,
  onRemoved,
  onEdited,
}: SpeakerListProps) {
  return (
    <ul className="space-y-2">
      {speakers.map((speaker) => (
        <li key={speaker.id}>
          <div className="p-4 rounded-lg hover:shadow-md transition-shadow duration-500 border border-gray-100">
            <div className="text-xl font-semibold">
              {speaker.name} ({speaker.title})
            </div>
            <div className="mt-2 text-sm font-semibold">{speaker.company}</div>
            <div className="mt-2 text-sm text-gray-500">{speaker.bio}</div>
            <div className="flex justify-end gap-x-4">
              {showEditButton && (
                <EditSpeakerDialog
                  label="Edit"
                  speaker={speaker}
                  onEdited={onEdited}
                  onRemoved={onRemoved}
                />
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
