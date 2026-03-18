import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/InstallPrompt";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://billies-dictionary.vercel.app";

export const metadata: Metadata = {
  title: "Billie's Dictionary",
  description:
    "Dictionary with definitions, etymology, synonyms, antonyms, and slang—North American and Black English context.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Billie's Dictionary",
    description:
      "Dictionary with definitions, etymology, synonyms, antonyms, and slang—North American and Black English context.",
    url: siteUrl,
    siteName: "Billie's Dictionary",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billie's Dictionary",
    description:
      "Dictionary with definitions, etymology, synonyms, antonyms, and slang—North American and Black English context.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <InstallPrompt />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
