"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AnnouncementBar
//
// A slim sticky bar that sits ABOVE the Navbar — fixed to the top of the
// viewport. Displays: CPBYTE logo × KIET logo · Event dates · Live badge.
//
// Theme: dark brand-dark background (#1E293B) with the four-colour bottom
// border strip (matching the logo's accent bars) — ties it to CodeRush
// visual identity. Height is deliberately compact (h-9 / 36px) so it
// doesn't compete with the Navbar below it.
//
// Usage in layout.tsx / page.tsx:
//   <AnnouncementBar />
//   <Navbar />
//   — Navbar must add `top-9` instead of `top-0` so it sits below this bar.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";
import { CONTEST_DATES } from "@/lib/constants";

export default function AnnouncementBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60]"
      role="banner"
      aria-label="CodeRush event announcement"
    >
      {/* ── Main bar ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-9"
        style={{ background: "#1E293B" }}
      >
        {/* Left: logos + × separator */}
        <div className="flex items-center gap-2.5">
          {/* CPBYTE logo */}
          <Image
            src="/assets/cpbyte-logo.png"
            alt="CPBYTE"
            width={60}
            height={20}
            className="h-10 w-auto object-contain"
          />

          {/* × separator */}
          <span
            className="font-mono text-[13px] font-bold leading-none select-none"
            style={{ color: "rgba(255,255,255,0.35)" }}
            aria-hidden="true"
          >
            x
          </span>

          {/* KIET logo */}
          <Image
            src="/assets/kiet-logo.png"
            alt="KIET Group of Institutions"
            width={60}
            height={20}
            className="h-6 w-auto object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
<span
              className="font-mono text-[10px] tracking-wider text-white/85 uppercase hidden md:inline-block font-bold select-none"
            >
              KIET Deemed to be University
            </span>
        </div>

        {/* Centre: event name — hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Pulsing live dot */}
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red" />
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            CodeRush Season IV
          </span>
        </div>

        {/* Right: event dates */}
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] uppercase tracking-widest font-bold"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            {CONTEST_DATES}
          </span>
        </div>
      </div>

      {/* ── Four-colour bottom border — CodeRush brand accent strip ── */}
      <div className="flex w-full h-[2px]" aria-hidden="true">
        <div className="flex-1 bg-brand-blue"   />
        <div className="flex-1 bg-brand-yellow" />
        <div className="flex-1 bg-brand-green"  />
        <div className="flex-1 bg-brand-red"    />
      </div>
    </div>
  );
}