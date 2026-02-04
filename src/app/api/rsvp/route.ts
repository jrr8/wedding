import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";
import { cookies } from "next/headers";
import { updateRows, getSheet, getSheetMap, logDebug, SheetRow } from "@/utils/sheets";
import { getCurrentUser, getCurrentUserParty } from "@/utils/currentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  let currentUser = await getCurrentUser();
  let currentUserParty = await getCurrentUserParty(currentUser);

  if (currentUser) {
    return NextResponse.json({
      currentUser,
      currentUserParty,
    });
  }

  const name = req.nextUrl.searchParams.get("name")?.trim().toLowerCase() ?? "";
  const cookieStore = await cookies();

  try {
    const sheet = await getSheet();

    const names = sheet.map((row) => row.name);
    const closestName = getClosestName(name, names);

    if (closestName) {
      currentUser = sheet.find((row) => row.name === closestName) ?? null;
    }

    if (!currentUser) {
      await logDebug(name, "Lookup failed");
      return NextResponse.json({
        error:
          "We can't find you in our records. Please check your spelling and try again.",
      });
    }

    cookieStore.set("user", currentUser.id);
    currentUserParty = await getCurrentUserParty(currentUser);
    return NextResponse.json({ currentUser, currentUserParty });
  } catch (err) {
    console.error(err);
    await logDebug(name, err);
    return NextResponse.json(
      {
        error:
          "There was an error looking up your name. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data: Pick<
    SheetRow,
    "id" | "rsvpCeremony" | "rsvpWelcome" | "dietaryRestrictions"
  >[] = body.currentUserParty;

  try {
    const sheet = await getSheetMap();
    const updates = data
      .map((row) => ({
        index: sheet.get(row.id)?.index ?? -1,
        values: [row.rsvpCeremony, row.rsvpWelcome, row.dietaryRestrictions],
      }))
      .filter((update) => update.index !== -1);

    const overwrites = data.map((update) => {
      const row = sheet.get(update.id)?.row;
      if (!row) return;

      let s = ""
      if (row.rsvpCeremony !== null && row.rsvpCeremony !== update.rsvpCeremony) {
        s += `- Ceremony: ${row.rsvpCeremony} -> ${update.rsvpCeremony}\n`;
      }
      if (row.rsvpWelcome !== null && row.rsvpWelcome !== update.rsvpWelcome) {
        s += `- Welcome: ${row.rsvpWelcome} -> ${update.rsvpWelcome}\n`;
      }
      if (row.dietaryRestrictions !== null && row.dietaryRestrictions !== update.dietaryRestrictions) {
        s += `- Dietary: "${row.dietaryRestrictions}" -> "${update.dietaryRestrictions}"\n`;
      }
      if (s) {
        s = `RSVP updated: ${row.name}\n${s}`;
      }

      return s;
    }).filter(Boolean);

    if (overwrites.length > 0) {
      await logDebug(currentUser.name, overwrites);
    }

    await updateRows("D:F", updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    await logDebug(currentUser.name, err);
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
