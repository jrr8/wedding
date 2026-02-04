import { cookies } from "next/headers";
import { getSheet, SheetRow } from "@/utils/sheets";

export const getCurrentUser = async (): Promise<SheetRow | null> => {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user")?.value;

  // No cookie = no user, skip the sheet lookup entirely
  if (!currentUserId) return null;

  try {
    const sheet = await getSheet();
    return sheet.find((row) => row.id === currentUserId) ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getCurrentUserParty = async (
  currentUser: SheetRow | null
): Promise<SheetRow[]> => {
  if (!currentUser) return [];
  if (!currentUser.partyId) return [currentUser];

  const sheet = await getSheet();
  return sheet.filter((row) => row.partyId === currentUser.partyId);
};
