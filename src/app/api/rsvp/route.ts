import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";
import { cookies } from "next/headers";
import { appendRows, getSheets, getSheet, logError } from "@/utils/sheets";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const name = req.nextUrl.searchParams.get("name")?.trim().toLowerCase() ?? "";
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user")?.value;

  const sheets = getSheets();

  try {
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
    await logError(sheets, name, err);
    return NextResponse.json({ error: "Failed to get RSVP" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const sheets = getSheets();

  try {
    // Append new row
    await appendRows(sheets, "A:D", [
      [data.name, data.preference, data.email || "", data.phone || ""],
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    await logError(sheets, data.name, err);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

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
