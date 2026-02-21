"use client";

import { clearUserCookie } from "@/app/actions";
import { SheetRow } from "@/utils/sheets";
import { useEffect, useState } from "react";
import { EnterNameForm } from "./EnterNameForm";
import { RSVPForm } from "./RSVPForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = "loading" | "enterName" | "rsvp";

export default function RSVPModal({ isOpen, onClose }: Props) {
  const [currentUserParty, setCurrentUserParty] = useState<SheetRow[]>([]);
  const [step, setStep] = useState<Step>("loading");

  useEffect(() => {
    setStep("loading");

    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((data) => {
        const party = data.currentUserParty as SheetRow[] | null;
        if (party && party.length > 0) {
          setCurrentUserParty(party);
          setStep("rsvp");
        } else {
          setStep("enterName");
        }
      })
      .catch(() => setStep("enterName"));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "loading" ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-900 border-t-transparent rounded-full" />
          </div>
        ) : step === "enterName" ? (
          <EnterNameForm
            onClose={onClose}
            onUserFound={(party) => {
              setCurrentUserParty(party);
              setStep("rsvp");
            }}
          />
        ) : (
          <RSVPForm
            onClose={onClose}
            currentUserParty={currentUserParty}
            onClearUser={async () => {
              await clearUserCookie();
              setCurrentUserParty([]);
              setStep("enterName");
            }}
          />
        )}
      </div>
    </div>
  );
}
