"use client";

import { useState } from "react";
import AppPage from "@/components/app-page";
import ConferenceFilterPanel from "@/components/conference-filters";
import ConferenceList from "@/components/conference-list";
import type { ConferenceFilters } from "@/lib/ui-types";

export default function Home() {
  const [filters, setFilters] = useState<ConferenceFilters>({
    tags: [],
  });

  return (
    <AppPage>
      <h1 className="sr-only">Home page</h1>
      <div>
        <ConferenceFilterPanel
          onApply={(filters) => {
            setFilters(filters);
          }}
        />
        <ConferenceList filters={filters} />
      </div>
    </AppPage>
  );
}
