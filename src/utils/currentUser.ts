import { cookies } from "next/headers";
import { getSheets, getSheet, SheetRow } from "@/utils/sheets";

export const getCurrentUser = async (): Promise<SheetRow | null> => {
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user")?.value;

  const sheets = getSheets();

  try {
    const sheet = await getSheet(sheets);

    const currentUserRow = currentUserId
      ? sheet.find((row) => row.id === currentUserId)
      : null;

    return currentUserRow ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
