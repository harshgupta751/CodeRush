// src/app/page.tsx
//
// Root page — Server Component.
// Assembles all CodeRush sections in order. No "use client" here — this
// file has zero hooks/state of its own. Every interactive piece (Navbar's
// scroll shadow, Hero's animations, the scroll-aware mobile FAB, etc.) is
// already self-contained inside its own "use client" component, so this
// page can stay a Server Component for better SSR/streaming and to keep
// the option open for adding generateMetadata / server data fetching here
// later without needing to restructure anything.
//
// ─── CHANGING THE REGISTRATION LINK ──────────────────────────────────────────
// The Unstop URL is defined once in:
//
//   src/lib/constants.ts  →  export const UNSTOP_HREF = "..."
//
// Changing it there propagates automatically to the Navbar, Hero, Footer,
// and the FAB. You do not need to touch any other file.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Component imports ────────────────────────────────────────────────────────
import AnnouncementBar     from "@/components/AnnouncementBar";
import Navbar               from "@/components/Navbar";
import Hero                 from "@/components/Hero";
import HeroFabTrigger       from "@/components/RegisterFAB";
import AboutOverview        from "@/components/AboutOverview";
import TimelineEligibility  from "@/components/TimelineEligibility";
import EndSectors           from "@/components/EndSectors";

export default function Page() {
  return (
    <>
      {/* ── Announcement bar — sits above Navbar, fixed z-[60] ──────────── */}
      {/* AnnouncementBar is z-[60], Navbar is z-50 — bar always on top.    */}
      <AnnouncementBar />

      {/* ── Sticky navigation bar ─────────────────────────────────────── */}
      {/*
        Navbar uses `fixed top-9` internally (36px = height of
        AnnouncementBar) so it sits directly below the announcement strip.
      */}
      <Navbar />

      {/* ── Main page content ─────────────────────────────────────────── */}
      <main id="main-content" aria-label="CodeRush main content">

        {/* Skip-to-content — top-[6.25rem] = AnnouncementBar (36px) +
            Navbar (64px) + 4px gap so it never overlaps either bar.       */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            fixed top-[106px] left-4 z-[60]
            bg-white border border-brand-blue text-brand-blue
            font-mono text-xs px-4 py-2 rounded-md
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-brand-blue
          "
        >
          Skip to main content
        </a>

        {/* 1. Hero — the page thesis and primary conversion surface */}
        <Hero />

        {/* HeroFabTrigger is a self-contained client component: it renders
            the zero-height hero sentinel AND the scroll-aware mobile FAB
            together. page.tsx does not need any hooks to use it. */}
        <HeroFabTrigger />

        {/* 2. About + Overview — story and bento grid metrics */}
        <AboutOverview />

        {/* 3. Timeline + Eligibility — schedule and participation criteria */}
        <TimelineEligibility />

        {/* 4. Sponsors + FAQ + Footer — closing trust signals and navigation */}
        <EndSectors />

      </main>
    </>
  );
}