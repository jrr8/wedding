"use client";

import { SheetRow } from "@/utils/sheets";
import { useEffect, useState } from "react";
import { EnterNameForm } from "./EnterNameForm";
import { RSVPForm } from "./RSVPForm";
import { EditRSVPForm } from "./EditRSVPForm";

type Preference = "text" | "email" | "both" | "";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SheetRow | null;
  currentUserParty: SheetRow[];
};

export default function RSVPModal({
  isOpen,
  onClose: onCloseProp,
  currentUser,
  currentUserParty,
}: Props) {
  const [name, setName] = useState(currentUser?.name ?? "");
  const [preference, setPreference] = useState<Preference>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const reset = () => {
    setName(currentUser?.name ?? "");
    setPreference("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  const onClose = () => {
    reset();
    onCloseProp();
  };

  const validate = () => {
    const newErrors: { email?: string; phone?: string } = {};

    if (
      (preference === "email" || preference === "both") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      (preference === "text" || preference === "both") &&
      !/^\d{10}$/.test(phone.replace(/\D/g, "")) // allow dashes/spaces but must be 10 digits
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const payload = { name, preference, email, phone };

    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Thanks! We'll keep you updated.");
    setIsLoading(false);
    onClose();
  };

  const hasSubmittedRsvp = typeof currentUser?.rsvpCeremony === "boolean";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">
          {!currentUser
            ? "Enter your name"
            : !hasSubmittedRsvp
            ? "RSVP"
            : "Edit your RSVP"}
        </h2>
        <p className="text-sm">
          {!currentUser ? (
            <>
              Enter your name to RSVP.
              <br />
              If there are multiple people in your party, you will be able to
              respond for each person.
            </>
          ) : !hasSubmittedRsvp ? (
            <>
              Please RSVP by March 30th.
              <br />
              You can edit your response any time before then.
            </>
          ) : (
            <>
              Here&apos;s what we have you marked down for.
              <br />
              You can edit your response until March 30th.
            </>
          )}
        </p>

        {!currentUser ? (
          <EnterNameForm />
        ) : !hasSubmittedRsvp ? (
          <RSVPForm />
        ) : (
          <EditRSVPForm />
        )}
      </div>
    </div>
  );
}
