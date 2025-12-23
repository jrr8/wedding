import { google, sheets_v4 } from "googleapis";
import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";

const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
const spreadsheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";

type Sheets = sheets_v4.Sheets;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const name = req.nextUrl.searchParams.get("name")?.trim().toLowerCase() ?? "";

  try {
    const sheets = getSheets();
    const names = await getColumn(sheets, "C2:C");

    const closestName = getClosestName(name, names);

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
      range: getRange("A:D"),
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

const getRange = (range: string): string => {
  return `${spreadsheetName}!${range}`;
};

const getColumn = async <T = string>(
  sheets: Sheets,
  range: string
): Promise<T[]> => {
  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: getRange(range),
    majorDimension: "COLUMNS",
  });
  return values?.[0] || [];
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
