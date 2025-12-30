import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";
import { cookies } from "next/headers";
import {
  appendRows,
  getSheet,
  logError,
  SheetRow,
} from "@/utils/sheets";
import { getCurrentUser } from "@/utils/currentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return NextResponse.json({
      closestName: currentUser.name,
    });
  }

  const name = req.nextUrl.searchParams.get("name")?.trim().toLowerCase() ?? "";
  const cookieStore = await cookies();

  try {
    const sheet = await getSheet();

    const names = sheet.map((row) => row.name);
    const closestName = getClosestName(name, names);

    let currentUserRow: SheetRow | undefined;
    if (closestName) {
      currentUserRow = sheet.find((row) => row.name === closestName);
    }

    if (currentUserRow) {
      cookieStore.set("user", currentUserRow.id);
    }

    return NextResponse.json({ closestName: currentUserRow?.name ?? null });
  } catch (err) {
    console.error(err);
    await logError(name, err);
    return NextResponse.json({ error: "Failed to get RSVP" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();

  try {
    // Append new row
    await appendRows("A:D", [
      [data.name, data.preference, data.email || "", data.phone || ""],
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    await logError(data.name, err);
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
