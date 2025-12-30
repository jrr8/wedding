import { google, sheets_v4 } from "googleapis";
import { cache } from "react";

const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const spreadsheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";
const errorSheetName = "RSVP-errors";

type Sheets = sheets_v4.Sheets;

let _sheetsClient: Sheets | null = null;

const _getSheetsClient = (): Sheets => {
  if (_sheetsClient) {
    return _sheetsClient;
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  _sheetsClient = google.sheets({ version: "v4", auth });
  return _sheetsClient;
};

const sheetRange = (range: string = ""): string => {
  return range ? `${spreadsheetName}!${range}` : spreadsheetName;
};

export const logError = async (
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

  const sheetsClient = _getSheetsClient();
  await sheetsClient.spreadsheets.values.append({
    spreadsheetId,
    range: errorSheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[new Date().toISOString(), userName, errorMessage]],
    },
  });
};

export const getSheet = cache(async (): Promise<SheetRow[]> => {
  const sheetsClient = _getSheetsClient();
  const {
    data: { values },
  } = await sheetsClient.spreadsheets.values.get({
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

  return result;
});

export const updateRows = async (
  columnRange: string,
  updates: { index: number; values: Array<string | boolean | null> }[]
): Promise<void> => {
  const sheetsClient = _getSheetsClient();
  const [startCol, endCol] = columnRange.split(":");
  const rowRange = (index: number) =>
    // Plus 2: one for 0/1 index, one for skipping header row
    `${startCol}${index + 2}:${endCol}${index + 2}`;

  await sheetsClient.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: updates.map(({ index, values }) => ({
        range: sheetRange(rowRange(index)),
        values: [values],
      })),
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
