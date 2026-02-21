"use client";

import { clearUserCookie } from "@/app/actions";
import { useEffect } from "react";
import { EnterNameForm } from "./EnterNameForm";
import { useRSVP } from "./RSVPContext";
import { RSVPForm } from "./RSVPForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RSVPModal({ isOpen, onClose }: Props) {
  const { currentUserParty, setCurrentUserParty, isLoading } = useRSVP();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const step = isLoading
    ? "loading"
    : currentUserParty.length > 0
      ? "rsvp"
      : "enterName";

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
            }}
          />
        ) : (
          <RSVPForm
            onClose={onClose}
            currentUserParty={currentUserParty}
            onClearUser={async () => {
              await clearUserCookie();
              setCurrentUserParty([]);
            }}
          />
        )}
      </div>
    </div>
  );
}
