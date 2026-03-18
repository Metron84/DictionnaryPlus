import { search } from "@/lib/dictionary";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await search(q);
  return Response.json(results);
}
