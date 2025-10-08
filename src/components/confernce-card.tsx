import { formatRelative } from "date-fns";
import Link from "next/link";
import type { Conference } from "@/app/api/conference/types";

interface ConferenceCardProps {
  conference: Conference;
}

export default function ConferenceCard({ conference }: ConferenceCardProps) {
  const formattedDate = formatRelative(conference.date, new Date());
  const href = `/conferences/${conference.id}`;
  return (
    <div className="p-4 rounded-lg hover:shadow-md transition-shadow duration-500 border border-gray-100">
      <Link href={href} className="text-2xl font-semibold">
        {conference.name}
      </Link>
      <div className="mt-2 text-sm font-semibold">{formattedDate}</div>
      <div className="mt-2 text-sm text-gray-500">{conference.location}</div>
      <div className="mt-2 font-semibold text-sm">${conference.price}</div>
    </div>
  );
}
