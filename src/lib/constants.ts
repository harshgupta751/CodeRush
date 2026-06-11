// ─────────────────────────────────────────────────────────────────────────────
// src/lib/constants.ts
//
// Single source of truth for all global contest constants.
// Every component that needs the Unstop registration URL, contest name,
// or edition string imports from here — nothing is hardcoded locally.
//
// TO UPDATE THE REGISTRATION LINK:
//   Change UNSTOP_HREF below. The change propagates automatically to
//   the Navbar, Hero, and Footer without touching any other file.
// ─────────────────────────────────────────────────────────────────────────────

/** The Unstop event registration URL. Change this to go live. */
export const UNSTOP_HREF = "https://unstop.com/your-event-link";

/** Human-readable contest name used in headings, metadata, and aria labels. */
export const CONTEST_NAME = "CodeRush";

/** Organiser name — used in footer copy and metadata. */
export const ORGANISER_NAME = "CPBYTE — KIET Group of Institutions";

/** Current season / edition string. */
export const CONTEST_EDITION = "Season IV · 2025";

/** Contest dates — displayed in the Hero accent line and footer. */
export const CONTEST_DATES = "21 – 22 Aug 2026";

/** Contest venue string. */
export const CONTEST_VENUE = "KIET Group of Institutions, Ghaziabad";

/** Registration deadline — displayed in the Footer CTA column. */
export const REGISTRATION_DEADLINE = "14th August 2026";