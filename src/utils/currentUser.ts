import { cookies } from "next/headers";
import { getSheet, SheetRow } from "@/utils/sheets";

export const getCurrentUser = async (): Promise<SheetRow | null> => {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user")?.value;


  try {
    const sheet = await getSheet();

    const currentUserRow = currentUserId
      ? sheet.find((row) => row.id === currentUserId)
      : null;

    return currentUserRow ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getCurrentUserParty = async (): Promise<SheetRow[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];
  if (!currentUser.partyId) return [currentUser];

  const sheet = await getSheet();
  return sheet.filter((row) => row.partyId === currentUser.partyId);
};
