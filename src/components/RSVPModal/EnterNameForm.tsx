import { SheetRow } from "@/utils/sheets";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onUserFound: (user: SheetRow, party: SheetRow[]) => void;
};

export const EnterNameForm = ({ onClose, onUserFound }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setIsLoading(true);

    const body = await fetch(`/api/rsvp?name=${trimmedName}`).then((res) =>
      res.json()
    );
    setIsLoading(false);

    if (body.currentUser && body.currentUserParty) {
      onUserFound(body.currentUser, body.currentUserParty);
    } else {
      setError(
        body.error ?? "There was an unknown error. Please try again later."
      );
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold">Enter your name</h2>
      <p className="text-sm">
        If there are multiple people in your party, you will be able to respond
        for each person.
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
    </>
  );
};
