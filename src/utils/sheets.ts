import { google, sheets_v4 } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const spreadsheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";
const debugSheetName = "RSVP-debug";

type Sheets = sheets_v4.Sheets;

let _sheetsClient: Sheets | null = null;

// In-memory cache for sheet data - clears on redeploy
let _sheetCache: SheetRow[] | null = null;

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

export const logDebug = async (
  userName: string,
  message: unknown
): Promise<void> => {
  const messages = Array.isArray(message) ? message : [message];

  const debugMessages = messages.map((message) => {
    let debugMessage = "";
    if (message instanceof Error) {
      const stack = message.stack ?? "";
      for (const line of stack.split("\n")) {
        if (line.includes("wedding/node_modules")) break;
        debugMessage += line + "\n";
      }
      if (!debugMessage) {
        debugMessage = message.message;
      }
    } else {
      debugMessage = String(message);
    }
    return debugMessage;
  });

  const sheetsClient = _getSheetsClient();
  await sheetsClient.spreadsheets.values.append({
    spreadsheetId,
    range: debugSheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: debugMessages.map((message) => [new Date().toISOString(), userName, message]),
    },
  });
};

const _fetchSheetFromAPI = async (): Promise<SheetRow[]> => {
  const sheetsClient = _getSheetsClient();
  const {
    data: { values },
  } = await sheetsClient.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange(),
  });
  if (!values?.length) return [];

  return values.slice(1).map((row) => ({
    id: row[0],
    partyId: row[1] || null,
    name: row[2],
    rsvpCeremony: row[3] ? row[3] === "TRUE" : null,
    rsvpWelcome: row[4] ? row[4] === "TRUE" : null,
    dietaryRestrictions: row[5] || null,
  }));
};

export const getSheet = async (): Promise<SheetRow[]> => {
  if (_sheetCache === null) {
    _sheetCache = await _fetchSheetFromAPI();
  }
  return _sheetCache;
};

export const getSheetMap = async (): Promise<Map<string, { row: SheetRow; index: number }>> => {
  const sheet = await getSheet();
  return new Map(sheet.map((row, index) => [row.id, { row, index }]));
};

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

  // Update in-memory cache after successful write
  if (_sheetCache && columnRange === "D:F") {
    for (const { index, values } of updates) {
      if (_sheetCache[index]) {
        _sheetCache[index].rsvpCeremony = values[0] as boolean | null;
        _sheetCache[index].rsvpWelcome = values[1] as boolean | null;
        _sheetCache[index].dietaryRestrictions = values[2] as string | null;
      }
    }
  }
};

export type SheetRow = {
  id: string;
  partyId: string | null;
  name: string;
  rsvpCeremony: boolean | null;
  rsvpWelcome: boolean | null;
  dietaryRestrictions: string | null;
};
