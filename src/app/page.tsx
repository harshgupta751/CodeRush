// src/app/page.tsx
//
// Root page — assembles all CodeRush sections in order and mounts the
// scroll-aware mobile FAB (Floating Action Button).
//
// ─── CHANGING THE REGISTRATION LINK ──────────────────────────────────────────
// The Unstop URL is defined once in:
//
//   src/lib/constants.ts  →  export const UNSTOP_HREF = "..."
//
// Changing it there propagates automatically to the Navbar, Hero, Footer,
// and the FAB below. You do not need to touch any other file.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

// ─── Component imports ────────────────────────────────────────────────────────
import Navbar            from "@/components/Navbar";
import Hero              from "@/components/Hero";
import AboutOverview     from "@/components/AboutOverview";
import TimelineEligibility from "@/components/TimelineEligibility";
import EndSectors        from "@/components/EndSectors";

// ─── Shared constants ─────────────────────────────────────────────────────────
// UNSTOP_HREF is the single global registration URL.
// All other components import it from the same file — edit once, propagates
// everywhere. The FAB below also consumes it directly from constants.
import { UNSTOP_HREF } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// RegisterFAB
//
// A sticky Floating Action Button that appears in the lower-right corner on
// mobile screens only (hidden on md+) once the user has scrolled past the
// Hero section.
//
// Visibility logic:
//   - Mount: tracks a ref placed at the bottom of the Hero section.
//   - Uses IntersectionObserver (not a scroll event listener) so there is
//     zero main-thread scroll jank. The FAB appears when the hero sentinel
//     exits the viewport from the top (i.e. the hero is fully scrolled past).
//   - AnimatePresence handles mount/unmount with a spring-based slide-up
//     and fade so it feels physical rather than abrupt.
//
// Accessibility:
//   - aria-label describes the action and destination explicitly.
//   - focus-visible ring uses brand-blue, consistent with all other CTAs.
//   - The button is rendered as an <a> so it is natively keyboard-navigable
//     and opens correctly in a new tab.
// ─────────────────────────────────────────────────────────────────────────────

// Spring variant — the FAB slides up from y=24 and fades in.
// Exit is the reverse: slides back down and fades out.
// Using a spring (type: "spring") gives it a slightly bouncy arrival
// that feels more physical than a plain ease curve.
const fabVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 26,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.92,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

interface RegisterFABProps {
  // Ref to the element whose exit from the viewport triggers the FAB.
  // Pass a ref placed at the bottom of the Hero section.
  heroSentinelRef: React.RefObject<HTMLDivElement | null>;
}

function RegisterFAB({ heroSentinelRef }: RegisterFABProps) {
  // true = hero has been scrolled past → show FAB
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;

    // IntersectionObserver fires when the sentinel enters/exits the viewport.
    // When it is NOT intersecting (isIntersecting: false), the user has scrolled
    // past the hero and we show the FAB. When it IS intersecting, we hide it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        // rootMargin "-1px" at the top so the FAB appears the instant the
        // sentinel pixel crosses the top of the viewport, not one frame later.
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [heroSentinelRef]);

  return (
    // The outer wrapper is always rendered — AnimatePresence requires its
    // children to be present in the tree to orchestrate exit animations.
    // The wrapper itself is pointer-events-none so it never accidentally
    // blocks clicks when the FAB is not visible.
    <div
      className="
        fixed bottom-6 right-4 z-50
        pointer-events-none
        md:hidden
      "
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {isVisible && (
          <motion.a
            key="register-fab"
            href={UNSTOP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register for CodeRush on Unstop — opens in a new tab"
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Re-enable pointer events only when the FAB is actually mounted
            className="
              pointer-events-auto
              inline-flex items-center gap-2
              bg-brand-blue hover:bg-brand-blue/90
              active:scale-[0.96]
              text-white font-mono text-xs font-medium
              uppercase tracking-widest
              rounded-full
              px-5 py-3
              shadow-lg shadow-brand-blue/30
              transition-colors duration-150
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-white
            "
            // Framer Motion `whileTap` gives a tactile press response on touch
            whileTap={{ scale: 0.94 }}
          >
            Register
            <ExternalLink size={12} strokeWidth={2.5} aria-hidden="true" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  // heroSentinelRef is attached to an invisible zero-height div placed
  // directly after the Hero component. When this div scrolls off the top of
  // the viewport, the FAB becomes visible.
  const heroSentinelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* ── Sticky navigation bar ─────────────────────────────────────── */}
      {/*
        Navbar is rendered outside the main <main> landmark so it is not
        counted as page content by screen readers navigating by landmark.
        It manages its own `fixed top-0` positioning internally.
      */}
      <Navbar />

      {/* ── Main page content ─────────────────────────────────────────── */}
      <main id="main-content" aria-label="CodeRush main content">

        {/* Skip-to-content anchor target — improves keyboard navigation.
            The Navbar's "Register Now" and logo links are the first focusable
            elements; this lets keyboard users jump straight to content. */}
        <a
          href="#main-content"
          className="
            sr-only focus:not-sr-only
            fixed top-20 left-4 z-[60]
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

        {/* Hero sentinel — a zero-height invisible div immediately after Hero.
            The IntersectionObserver in RegisterFAB watches this element.
            When it exits the viewport upward, the FAB appears.
            When it re-enters (user scrolls back up), the FAB disappears. */}
        <div
          ref={heroSentinelRef}
          aria-hidden="true"
          className="h-0 w-full pointer-events-none"
        />

        {/* 2. About + Overview — story and bento grid metrics */}
        <AboutOverview />

        {/* 3. Timeline + Eligibility — schedule and participation criteria */}
        <TimelineEligibility />

        {/* 4. Sponsors + FAQ + Footer — closing trust signals and navigation */}
        <EndSectors />

      </main>

      {/* ── Mobile floating action button ─────────────────────────────── */}
      {/*
        RegisterFAB is rendered outside <main> so its fixed positioning
        is not affected by any overflow:hidden on ancestor elements.
        It is only visible on screens narrower than the `md` breakpoint (768px).
        On desktop, the Navbar's persistent "Register Now" button serves
        the same conversion purpose.
      */}
      <RegisterFAB heroSentinelRef={heroSentinelRef} />
    </>
  );
}