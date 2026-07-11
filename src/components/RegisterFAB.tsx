"use client";

// ─────────────────────────────────────────────────────────────────────────────
// RegisterFAB
//
// A sticky Floating Action Button that appears in the lower-right corner on
// mobile screens only (hidden on md+) once the user has scrolled past the
// Hero section.
//
// This file exports HeroFabTrigger as the default — a fully self-contained
// client component that:
//   1. Creates its own heroSentinelRef internally (via useRef)
//   2. Renders the zero-height sentinel div (must sit immediately after Hero)
//   3. Renders the actual RegisterFAB button, wired to that sentinel
//
// Because this component owns all its hooks internally, the parent page.tsx
// can remain a plain Server Component — it just renders <HeroFabTrigger />
// right after <Hero /> with zero client-side state of its own.
//
// Visibility logic:
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

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { UNSTOP_HREF } from "@/lib/constants";

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
  heroSentinelRef: React.RefObject<HTMLDivElement | null>;
}

// The button itself — kept separate from HeroFabTrigger so it could be
// reused elsewhere with a different sentinel ref if ever needed.
export function RegisterFAB({ heroSentinelRef }: RegisterFABProps) {
  // true = hero has been scrolled past → show FAB
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;

    // IntersectionObserver fires when the sentinel enters/exits the viewport.
    // When it is NOT intersecting (isIntersecting: false), the user has
    // scrolled past the hero and we show the FAB. When it IS intersecting,
    // we hide it.
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
// HeroFabTrigger — default export
//
// Self-contained: owns its own heroSentinelRef via useRef, renders the
// sentinel div AND the RegisterFAB together. Drop this directly after
// <Hero /> in page.tsx — no props, no hooks needed in the parent.
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroFabTrigger() {
  const heroSentinelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Hero sentinel — a zero-height invisible div immediately after Hero.
          The IntersectionObserver in RegisterFAB watches this element.
          When it exits the viewport upward, the FAB appears.
          When it re-enters (user scrolls back up), the FAB disappears.    */}
      <div
        ref={heroSentinelRef}
        aria-hidden="true"
        className="h-0 w-full pointer-events-none"
      />

      {/* RegisterFAB is rendered here, outside <main>'s DOM flow concerns
          — its `fixed` positioning is unaffected by any ancestor overflow. */}
      <RegisterFAB heroSentinelRef={heroSentinelRef} />
    </>
  );
}