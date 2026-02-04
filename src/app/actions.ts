"use server";

import { cookies } from "next/headers";

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
}
