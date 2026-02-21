"use client";

import { SheetRow } from "@/utils/sheets";
import { createContext, useContext, useEffect, useState } from "react";

type RSVPContextValue = {
  currentUserParty: SheetRow[];
  setCurrentUserParty: (party: SheetRow[]) => void;
  isLoading: boolean;
};

const RSVPContext = createContext<RSVPContextValue | null>(null);

export function RSVPProvider({ children }: { children: React.ReactNode }) {
  const [currentUserParty, setCurrentUserParty] = useState<SheetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((data) => {
        const party = data.currentUserParty as SheetRow[] | null;
        if (party && party.length > 0) {
          setCurrentUserParty(party);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <RSVPContext.Provider
      value={{ currentUserParty, setCurrentUserParty, isLoading }}
    >
      {children}
    </RSVPContext.Provider>
  );
}

export function useRSVP() {
  const context = useContext(RSVPContext);
  if (!context) {
    throw new Error("useRSVP must be used within an RSVPProvider");
  }
  return context;
}
