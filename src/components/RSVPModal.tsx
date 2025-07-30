"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RSVPModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [preference, setPreference] = useState<"text" | "email" | "both" | "">(
    ""
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  if (!isOpen) return null;

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

    const payload = { name, preference, email, phone };

    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Thanks! We'll keep you updated.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Share Contact Details</h2>
        <p className="text-sm">
          We’re collecting contact info for important
          updates (like if there’s a rain delay). 
          RSVPs will be open once the official invitations go out. 
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
              {["Text", "Email", "Both"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="preference"
                    value={option}
                    checked={preference === option}
                    onChange={() => setPreference(option as any)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {preference === "Text" || preference === "Both" ? (
            <>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={preference !== "Email"}
                className="w-full border rounded p-2"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone}</p>
              )}
            </>
          ) : null}

          {preference === "Email" || preference === "Both" ? (
            <>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={preference !== "Text"}
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
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
