"use client";

import { useState } from "react";
import RSVPModal from "./RSVPModal";

export default function RSVPModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-3 bg-purple-900 text-white text-xl rounded-lg shadow hover:bg-pink-700 transition"
      >
        Share Your Contact for Updates
      </button>
      <RSVPModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
