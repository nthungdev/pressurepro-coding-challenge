"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { type KeyboardEventHandler, useState, useTransition } from "react";
import TagChips from "@/components/tag-chips";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DUPLICATE_TAG, EMPTY_TAG } from "@/lib/error-messages";
import { setConferenceTags } from "@/lib/fetches";

interface EditTagsDialogProps {
  conferenceId: string;
  initialTags: string[];
  label: string;
  onSuccess?: (tags: string[]) => void;
}

export default function EditTagsDialog({
  conferenceId,
  initialTags,
  label,
  onSuccess,
}: EditTagsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [errorMessage, setErrorMessage] = useState("");

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    setErrorMessage("");

    if (event.key === "Enter") {
      if (!value) {
        setErrorMessage(EMPTY_TAG);
        return;
      }

      if (tags.includes(value)) {
        setErrorMessage(DUPLICATE_TAG);
        return;
      }

      setTags([...tags, value]);
      setValue("");
    }
  };

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleSubmit() {
    startTransition(async () => {
      setErrorMessage("");
      const response = await setConferenceTags(conferenceId, { tags });
      if (!response.success) {
        setErrorMessage(response.error.message);
      } else {
        onSuccess?.(tags);
        setIsOpen(false);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 flex items-center">
        <span className="text-sm">{label}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit tags</DialogTitle>
          <DialogDescription>
            Enter tag name, then press enter to add the tag.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Input
            id="name"
            disabled={isPending}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder="Enter tag name"
            onKeyDown={handleKeyDown}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <TagChips
            className="mt-4"
            allowRemove
            tags={tags}
            onRemove={handleRemoveTag}
          />
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button disabled={isPending} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
