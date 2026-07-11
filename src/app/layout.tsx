// src/app/layout.tsx
//
// Root layout — now carries full SEO metadata: Open Graph (for social/link
// previews), Twitter Card, canonical URL, keyword-rich description, and
// structured data (JSON-LD) via <StructuredData />.

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import { SITE_URL } from "@/lib/constants";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // avoids invisible-text flash — small Core Web Vitals win
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase resolves all relative URLs below (OG images, canonical, etc.)
  metadataBase: new URL(SITE_URL),

  title: {
    default: "CodeRush Season IV | Competitive Programming Contest — CPBYTE KIET",
    template: "%s | CodeRush — CPBYTE KIET",
  },

  description:
    "CodeRush Season IV — an ICPC-style competitive programming contest by CPBYTE, KIET Group of Institutions. 21-22 August 2026. ₹10L+ prize pool, live leaderboard, open to students across India. Register free on Unstop.",

  keywords: [
    "CodeRush",
    "CPBYTE",
    "KIET competitive programming",
    "coding contest India",
    "ICPC style contest",
    "DSA hackathon",
    "competitive programming contest 2026",
    "KIET Ghaziabad hackathon",
    "college coding competition",
    "Unstop coding contest",
  ],

  authors: [{ name: "CPBYTE — KIET Group of Institutions" }],
  creator: "CPBYTE — KIET Group of Institutions",
  publisher: "CPBYTE — KIET Group of Institutions",

  // Canonical URL — prevents duplicate-content penalties if the site is
  // ever reachable via multiple hostnames (e.g. www vs non-www)
  alternates: {
    canonical: SITE_URL,
  },

  // Explicit robots directives (in addition to /robots.txt)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Open Graph — controls how the link looks when shared on WhatsApp,
  // LinkedIn, Facebook, Discord, iMessage, etc.
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "CodeRush — CPBYTE KIET",
    title: "CodeRush Season IV | Competitive Programming Contest",
    description:
      "ICPC-style contest by CPBYTE, KIET. 21-22 Aug 2026 · ₹10L+ prize pool · Open to all colleges across India.",
    images: [
      {
        url: "/og-image.jpg", // 1200×630 — see SEO strategy notes below
        width: 1200,
        height: 630,
        alt: "CodeRush Season IV — CPBYTE KIET",
      },
    ],
  },

  // Twitter/X Card — controls the preview card on twitter.com/x.com
  twitter: {
    card: "summary_large_image",
    title: "CodeRush Season IV | CPBYTE KIET",
    description:
      "ICPC-style contest · 21-22 Aug 2026 · ₹10L+ prize pool · Register free on Unstop.",
    images: ["/og-image.jpg"],
    creator: "@cpbyte_kiet",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-[102px]">
      <body
        suppressHydrationWarning
        className={`${sansFont.variable} ${monoFont.variable} antialiased bg-slate-50 text-slate-900 font-sans`}
      >
        {/* JSON-LD structured data — Event, Organization, FAQPage schemas.
            Renders as invisible <script> tags, does not affect layout. */}
        <StructuredData />
        {children}
      </body>
    </html>
  );
}