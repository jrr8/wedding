import { google, sheets_v4 } from "googleapis";
import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";
import { cookies } from "next/headers";

const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const spreadsheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";
const errorSheetName = "RSVP-errors";

type Sheets = sheets_v4.Sheets;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const name = req.nextUrl.searchParams.get("name")?.trim().toLowerCase() ?? "";
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user")?.value

  try {
    const sheets = getSheets();
    const sheet = await getSheet(sheets);

    let currentUserRow = currentUserId
      ? sheet.find((row) => row.id === currentUserId)
      : null;

    if (currentUserRow) {
      return NextResponse.json({
        closestName: currentUserRow.name,
      });
    }

    const names = sheet.map((row) => row.name);
    const closestName = getClosestName(name, names);

    if (closestName) {
      currentUserRow = sheet.find((row) => row.name === closestName);
    }

    if (currentUserRow) {
      cookieStore.set("user", currentUserRow.id);
    }

    return NextResponse.json({ closestName });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get RSVP" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();

  try {
    const sheets = getSheets();

    // Append new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetRange("A:D"),
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [data.name, data.preference, data.email || "", data.phone || ""],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

const getSheets = (): Sheets => {
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

const logError = async (sheets: Sheets, error: string): Promise<void> => {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(errorSheetName),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[Date.now(), error]] },
  });
};

const getColumn = async <T = string>(
  sheets: Sheets,
  range: string
): Promise<T[]> => {
  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange(range),
    majorDimension: "COLUMNS",
  });
  return values?.[0] || [];
};

const getSheet = async (sheets: Sheets): Promise<SheetRow[]> => {
  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
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

const similarity = (a: string, b: string): number => {
  return 1 - distance(a, b) / Math.max(a.length, b.length);
};

const getClosestName = (name: string, names: string[]): string | null => {
  let closestName: string | null = null;
  let maxSim = 0;

  for (const n of names) {
    const nLower = n.trim().toLowerCase();
    if (nLower === name) return n;

    const sim = similarity(name, nLower);
    if (sim < 0.85) continue;
    if (sim < maxSim) continue;

    maxSim = sim;
    closestName = n;
  }

  return closestName;
};

type SheetRow = {
  id: string;
  partyId: string | null;
  name: string;
  rsvpCeremony: boolean | null;
  rsvpWelcome: boolean | null;
  dietaryRestrictions: string | null;
};
