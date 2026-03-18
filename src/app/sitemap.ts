import type { MetadataRoute } from "next";
import { ALL_GENERATIONS } from "@/types/overlay";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://billies-dictionary.vercel.app";

const GENERATION_SLUGS: Record<string, string> = {
  "Gen Alpha": "gen-alpha",
  "Gen Z": "gen-z",
  Millennial: "millennial",
  "Gen X": "gen-x",
  Boomer: "boomer",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/slang`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/slang/random`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  const slangPages: MetadataRoute.Sitemap = ALL_GENERATIONS.map((gen) => ({
    url: `${baseUrl}/slang/${GENERATION_SLUGS[gen]}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...slangPages];
}
