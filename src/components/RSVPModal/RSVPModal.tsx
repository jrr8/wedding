"use client";

import { SheetRow } from "@/utils/sheets";
import { useEffect, useState } from "react";
import { EnterNameForm } from "./EnterNameForm";
import { RSVPForm } from "./RSVPForm";
import { EditRSVPForm } from "./EditRSVPForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SheetRow | null;
  currentUserParty: SheetRow[];
};

type Step = "enterName" | "rsvp" | "editRsvp";

export default function RSVPModal({
  isOpen,
  onClose,
  currentUser: currentUserProp,
  currentUserParty: currentUserPartyProp,
}: Props) {
  const [currentUser, setCurrentUser] = useState(currentUserProp);
  const [currentUserParty, setCurrentUserParty] =
    useState(currentUserPartyProp);

  const hasSubmittedRsvp = currentUserParty.every(
    (party) =>
      typeof party.rsvpCeremony === "boolean" &&
      typeof party.rsvpWelcome === "boolean"
  );

  const [step, setStep] = useState<Step>(
    !currentUser ? "enterName" : !hasSubmittedRsvp ? "rsvp" : "editRsvp"
  );

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
        {step === "enterName" ? (
          <EnterNameForm
            onClose={onClose}
            onUserFound={(user, party) => {
              setCurrentUser(user);
              setCurrentUserParty(party);
              setStep("rsvp");
            }}
          />
        ) : step === "rsvp" ? (
          <RSVPForm onClose={onClose} currentUserParty={currentUserParty} />
        ) : (
          <EditRSVPForm
          // onClose={onClose}
          //   currentUser={currentUser}
          //   currentUserParty={currentUserParty}
          />
        )}
      </div>
    </div>
  );
}
