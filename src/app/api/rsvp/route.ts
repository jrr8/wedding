import { NextResponse, NextRequest } from "next/server";
import { distance } from "fastest-levenshtein";
import { cookies } from "next/headers";
import { updateRows, getSheet, logError, SheetRow } from "@/utils/sheets";
import { getCurrentUser, getCurrentUserParty } from "@/utils/currentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  let currentUser = await getCurrentUser();
  let currentUserParty = await getCurrentUserParty();

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
      await logError(name, "Lookup failed");
      return NextResponse.json({
        error:
          "We can't find you in our records. Please check your spelling and try again.",
      });
    }

    cookieStore.set("user", currentUser.id);
    currentUserParty = await getCurrentUserParty();
    return NextResponse.json({ currentUser, currentUserParty });
  } catch (err) {
    console.error(err);
    await logError(name, err);
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
    const sheet = await getSheet();
    const updates = data
      .map((row) => ({
        index: sheet.findIndex((s) => s.id === row.id),
        values: [row.rsvpCeremony, row.rsvpWelcome, row.dietaryRestrictions],
      }))
      .filter((update) => update.index !== -1);

    await updateRows("D:F", updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    await logError(currentUser.name, err);
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
