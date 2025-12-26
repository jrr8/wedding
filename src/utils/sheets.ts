import { google, sheets_v4 } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const spreadsheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";
const errorSheetName = "RSVP-errors";

type Sheets = sheets_v4.Sheets;

export const getSheets = (): Sheets => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

const sheetRange = (range: string = ""): string => {
  return range ? `${spreadsheetName}!${range}` : spreadsheetName;
};

export const logError = async (
  sheets: Sheets,
  userName: string,
  error: unknown
): Promise<void> => {
  let errorMessage = "";
  if (error instanceof Error) {
    const stack = error.stack ?? "";
    for (const line of stack.split("\n")) {
      if (line.includes("wedding/node_modules")) break;
      errorMessage += line + "\n";
    }
    if (!errorMessage) {
      errorMessage = error.message;
    }
  } else {
    errorMessage = String(error);
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: errorSheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[new Date().toISOString(), userName, errorMessage]],
    },
  });
};

const TWENTY_SECONDS = 1000 * 20;
let _sheet_cache_at = 0;
let _cachedSheet: SheetRow[] | null = null;

export const getSheet = async (sheets: Sheets): Promise<SheetRow[]> => {
  const now = Date.now();
  if (_cachedSheet && now - _sheet_cache_at < TWENTY_SECONDS) {
    return _cachedSheet;
  }

  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange(),
  });
  if (!values?.length) return [];

  const result = values.slice(1).map((row) => ({
    id: row[0],
    partyId: row[1] || null,
    name: row[2],
    rsvpCeremony: row[3] ? row[3] === "TRUE" : null,
    rsvpWelcome: row[4] ? row[4] === "TRUE" : null,
    dietaryRestrictions: row[5] || null,
  }));

  _cachedSheet = result;
  _sheet_cache_at = now;

  return result;
};

export const appendRows = async (
  sheets: Sheets,
  range: string,
  values: string[][]
): Promise<void> => {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(range),
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
};

export type SheetRow = {
  id: string;
  partyId: string | null;
  name: string;
  rsvpCeremony: boolean | null;
  rsvpWelcome: boolean | null;
  dietaryRestrictions: string | null;
};
