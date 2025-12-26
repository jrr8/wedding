"use client";

import { useState } from "react";
import RSVPModal from "./RSVPModal";
import { SheetRow } from "@/utils/sheets";

type Props = {
  currentUser: SheetRow | null;
  currentUserParty: SheetRow[];
};

export default function RSVPModalButton({
  currentUser,
  currentUserParty,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-3 bg-purple-900 text-white text-xl rounded-lg shadow hover:bg-pink-700 transition"
      >
        RSVP Now
      </button>
      <RSVPModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        currentUserParty={currentUserParty}
      />
    </>
  );
}
