import { SheetRow } from "@/utils/sheets";
import { Fragment, useState } from "react";

type Props = {
  onClose: () => void;
  currentUserParty: SheetRow[];
};

export const RSVPForm = ({
  onClose,
  currentUserParty: currentUserPartyProp,
}: Props) => {
  const [error, setError] = useState("");
  const [step, setStep] = useState<"rsvp" | "dietary">("rsvp");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserParty, setCurrentUserParty] =
    useState(currentUserPartyProp);

  const handleRsvpChange = (idx: number, update: Partial<SheetRow>) => {
    const newRsvpState = [...currentUserParty];
    Object.assign(newRsvpState[idx], update);
    setCurrentUserParty(newRsvpState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const resp = await fetch("/api/rsvp", {
      method: "POST",
      body: JSON.stringify({
        currentUserParty: currentUserParty.map(
          ({ id, rsvpCeremony, rsvpWelcome, dietaryRestrictions }) => ({
            id,
            rsvpCeremony,
            rsvpWelcome,
            dietaryRestrictions,
          })
        ),
      }),
    }).then((res) => res.json());
    setIsLoading(false);

    if (resp.success) {
      onClose();
      return;
    }

    setError(
      resp.error ??
        "There was a problem submitting your RSVP. Please try again later."
    );
  };

  const renderEventSection = (
    title: string,
    eventType: "rsvpCeremony" | "rsvpWelcome"
  ) => (
    <div className="space-y-2">
      <h3 className="text-center font-bold">{title}</h3>
      <div className="grid grid-cols-3 gap-4 pb-2">
        <div></div>
        <div className="text-center italic">Will Attend</div>
        <div className="text-center italic">Will Not Attend</div>
      </div>
      {currentUserParty.map((party, idx) => (
        <div key={party.id} className="grid grid-cols-3 gap-4 items-center">
          <div>{party.name}</div>
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={party[eventType] === true}
              onChange={(e) => {
                handleRsvpChange(idx, {
                  [eventType]: e.target.checked ? true : null,
                });
              }}
              className="w-4 h-4"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={party[eventType] === false}
              onChange={(e) => {
                handleRsvpChange(idx, {
                  [eventType]: e.target.checked ? false : null,
                });
              }}
              className="w-4 h-4"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderDietarySection = () => (
    <div className="grid grid-cols-[fit-content(150px)_1fr] sm:grid-cols-[fit-content(250px)_1fr] gap-x-4 gap-y-2 items-center">
      {currentUserParty.map((party, idx) => (
        <Fragment key={party.id}>
          <div className="shrink-0 justify-self-start text-start">
            {party.name}
          </div>
          <div className="min-w-0">
            <input
              type="text"
              value={party.dietaryRestrictions ?? ""}
              onChange={(e) => {
                handleRsvpChange(idx, {
                  dietaryRestrictions: e.target.value,
                });
              }}
              className="w-full border rounded p-1"
            />
          </div>
        </Fragment>
      ))}
    </div>
  );

  const anyUnfilled = currentUserParty.some(
    (party) => party.rsvpCeremony === null || party.rsvpWelcome === null
  );

  return (
    <>
      <h2 className="text-xl font-bold">
        {step === "rsvp" ? "RSVP" : "Dietary restrictions"}
      </h2>
      <p className="text-sm">
        {step === "rsvp" ? (
          <>
            Please RSVP by March 30th.
            <br />
            You can edit your response any time before then.
          </>
        ) : (
          <>Please share any food allergies or dietary restrictions.</>
        )}
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === "rsvp" && (
          <>
            {renderEventSection("Welcome party", "rsvpWelcome")}
            <div className="border-b" />
            {renderEventSection("Ceremony & reception", "rsvpCeremony")}
          </>
        )}
        {step === "dietary" && renderDietarySection()}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          {step === "rsvp" && (
            <button
              type="button"
              disabled={anyUnfilled}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
              onClick={() => setStep("dietary")}
            >
              Next
            </button>
          )}
          {step === "dietary" && (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </>
  );
};
