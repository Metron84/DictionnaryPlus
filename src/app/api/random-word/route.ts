import { getRandomSlangSlug } from "@/lib/dictionary";
import { NextResponse } from "next/server";

/** Returns a random word slug so the client can redirect (fresh random on every request). */
export async function GET() {
  const slug = getRandomSlangSlug();
  return NextResponse.json({ slug });
}
