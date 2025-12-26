"use client";

import { SheetRow } from "@/utils/sheets";
import { useState } from "react";

type Preference = "text" | "email" | "both" | "";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SheetRow | null;
};

export default function RSVPModal({
  isOpen,
  onClose: onCloseProp,
  currentUser,
}: Props) {
  const [name, setName] = useState(currentUser?.name ?? "");
  const [preference, setPreference] = useState<Preference>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Share Contact Details</h2>
        <p className="text-sm">
          We’re collecting contact info for important updates (like if there’s a
          rain delay). RSVPs will be open once the official invitations go out.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />

          <div>
            <p className="font-medium text-sm mb-1">
              Do you prefer to get updates via email or text?
            </p>
            <div className="flex gap-4">
              {["Text", "Email", "Both"].map((option: string) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="preference"
                    value={option}
                    checked={preference === option.toLowerCase()}
                    onChange={() =>
                      setPreference(option.toLowerCase() as Preference)
                    }
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {preference === "text" || preference === "both" ? (
            <>
              <input
                type="tel"
                formNoValidate
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone}</p>
              )}
            </>
          ) : null}

          {preference === "email" || preference === "both" ? (
            <>
              <input
                type="email"
                formNoValidate
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded p-2"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </>
          ) : null}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
