"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ArrowDown, ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  UNSTOP_HREF,
  CONTEST_EDITION,
  CONTEST_DATES,
  CONTEST_VENUE,
} from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const HERO_TITLE_LINES = ["CODE", "RUSH"];

const STATS = [
  { value: "12,000+", label: "Registered" },
  { value: "₹10L",    label: "Prize Pool"  },
  { value: "48 hrs",  label: "Final Sprint" },
  { value: "200+",    label: "Colleges"    },
] as const;

const QUICK_FACTS = [
  { label: "Format",   value: "Solo · Team (2–4)" },
  { label: "Rounds",   value: "Qualifier · Semi · Final" },
  { label: "Platform", value: "Unstop + Custom Judge" },
  { label: "Venue",    value: CONTEST_VENUE },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Torch-spark particle — pure CSS animated ember dot.
// Each particle gets a random position, delay, and duration so the cluster
// looks organic. The motion is a slow float upward with horizontal drift,
// matching the flame rising from the logo's torch.
// ─────────────────────────────────────────────────────────────────────────────

interface SparkProps {
  style: React.CSSProperties;
}

function Spark({ style }: SparkProps) {
  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={style}
      aria-hidden="true"
    />
  );
}

// Generates 28 spark particles seeded with deterministic pseudo-random values
// so SSR and client render match exactly (no hydration mismatch).
function generateSparks() {
  // Deterministic LCG pseudo-random — avoids Math.random() on server
  let seed = 42;
  function rand() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  }

  // Flame colour stops from the logo: white-core → amber → orange → deep red
  const colours = [
    "#FFF5E0", "#FDE68A", "#FDBA74",
    "#FB923C", "#F97316", "#EA580C",
    "#DC2626", "#B91C1C",
  ];

  return Array.from({ length: 28 }, (_, i) => {
    const size   = 2 + rand() * 5;           // 2–7px
    const left   = 5 + rand() * 90;          // 5–95% across the title
    const delay  = rand() * 4;               // 0–4s stagger
    const dur    = 2.5 + rand() * 3;         // 2.5–5.5s float duration
    const colour = colours[Math.floor(rand() * colours.length)];
    const drift  = (rand() - 0.5) * 60;      // –30 to +30px horizontal drift

    return {
      id: i,
      style: {
        width:  size,
        height: size,
        left:   `${left}%`,
        bottom: `${80 + rand() * 20}%`,      // starts near / above the title
        backgroundColor: colour,
        boxShadow: `0 0 ${size * 2}px ${colour}`,
        opacity: 0,
        animation: `spark-float ${dur}s ${delay}s ease-in infinite`,
      } as React.CSSProperties,
    };
  });
}

const SPARKS = generateSparks();

// ─────────────────────────────────────────────────────────────────────────────
// Animated title — each character splits out individually.
// Uses Framer Motion stagger with a spring so letters arrive with weight.
// ─────────────────────────────────────────────────────────────────────────────

const titleContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.3 },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 18,
      mass: 0.8,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Counter — animates a number from 0 to its target value on mount.
// Pure JS requestAnimationFrame — zero dependencies.
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target: string, duration = 1800) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Extract numeric prefix and suffix (e.g. "12,000+" → num=12000, suffix="+")
    const numericStr = target.replace(/[^0-9.]/g, "");
    const num = parseFloat(numericStr);

    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    // Detect formatting: comma, suffix, prefix
    const hasComma  = target.includes(",");
    const suffix    = target.replace(/[0-9,.]*/g, "").replace(/^\s+/, "");
    const prefix    = target.startsWith("₹") ? "₹" : "";
    const cleanSuffix = suffix.replace(prefix, "");

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * num);

      let formatted = current.toString();
      if (hasComma && current >= 1000) {
        formatted = current.toLocaleString("en-IN");
      }

      setDisplay(`${prefix}${formatted}${cleanSuffix}`);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(started ? value : "0", 1600);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="font-mono text-2xl sm:text-3xl font-bold text-white leading-none tabular-nums">
        {started ? count : "0"}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScrollCaret — bouncing arrow at the very bottom of the hero
// ─────────────────────────────────────────────────────────────────────────────

function ScrollCaret() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      aria-hidden="true"
    >
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={16} className="text-white/40" strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FourBarAccent — the brand colour strip from the logo, animated in sequence
// ─────────────────────────────────────────────────────────────────────────────

function FourBarAccent() {
  const bars = [
    { color: "bg-brand-blue",   delay: 0.8  },
    { color: "bg-brand-yellow", delay: 0.95 },
    { color: "bg-brand-green",  delay: 1.1  },
    { color: "bg-brand-red",    delay: 1.25 },
  ] as const;

  return (
    <div className="absolute bottom-0 left-0 right-0 flex z-20" aria-hidden="true">
      {bars.map(({ color, delay }) => (
        <motion.div
          key={color}
          className={`flex-1 h-1 ${color}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <>
      {/*
        ── Global keyframe injected via a <style> tag.
        spark-float: each ember rises upward, drifts slightly sideways,
        and fades out — mimicking the logo torch flame.
        We cannot put arbitrary @keyframes in globals.css Tailwind v4 easily,
        so a scoped <style> inside the component is the cleanest approach.
      */}
      <style>{`
        @keyframes spark-float {
          0%   { opacity: 0;    transform: translateY(0)   translateX(0)    scale(1);   }
          10%  { opacity: 0.9;                                                           }
          60%  { opacity: 0.6;  transform: translateY(-80px) translateX(var(--dx, 20px)) scale(0.8); }
          100% { opacity: 0;    transform: translateY(-140px) translateX(var(--dx, 20px)) scale(0.3); }
        }
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1);    }
          50%       { opacity: 0.75; transform: scale(1.08); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <section
        className="relative w-full min-h-screen overflow-hidden bg-black"
        aria-label="Hero section"
      >

        {/* ══════════════════════════════════════════════════════════
            LAYER 1 — Full-bleed background video
            Covers entire viewport. Muted, looping, autoplay.
            Falls back to a dark slate bg-black if video fails to load.
        ══════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            {videoLoaded && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeIn" }}
              >
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <video
            src="/assets/hero-stream.mp4"
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />

          {/* Dark overlay always present so text is readable even before video */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            LAYER 2 — Ambient glow orbs (brand-blue + brand-red)
            Two soft radial glows sit behind the title, breathing
            slowly to give the dark canvas a sense of depth and
            warmth without overwhelming the video.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
        >
          {/* Blue glow — top-left */}
          <div
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(29,78,216,0.28) 0%, transparent 70%)",
              animation: "hero-glow-pulse 6s ease-in-out infinite",
            }}
          />
          {/* Red/orange glow — bottom-right, torch warmth */}
          <div
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(220,38,38,0.20) 0%, transparent 70%)",
              animation: "hero-glow-pulse 7s 1.5s ease-in-out infinite",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            LAYER 3 — Scanline texture overlay
            A single semi-transparent horizontal line sweeps top-to-
            bottom every 8 seconds, giving the video a subtle "live
            broadcast" feel that connects to the competitive arena theme.
        ══════════════════════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
              animation: "scanline 8s linear infinite",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            LAYER 4 — Spark particles (torch flame embers)
            28 CSS-animated ember dots float upward above the title,
            coloured using the exact flame gradient from the logo.
            They are absolutely positioned relative to the title area.
        ══════════════════════════════════════════════════════════ */}
        {!shouldReduceMotion && (
          <div
            className="pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          >
            {SPARKS.map((spark) => (
              <Spark key={spark.id} style={spark.style} />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            LAYER 5 — Main content
        ══════════════════════════════════════════════════════════ */}
        <div className="relative z-30 flex flex-col min-h-screen">

          {/* ── Top eyebrow bar ── */}
          <motion.div
            className="flex justify-center pt-28 pb-6"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="
                inline-flex items-center gap-2
                font-mono text-[10px] uppercase tracking-widest
                text-white/70
                border border-white/15 bg-white/5
                backdrop-blur-sm
                px-4 py-2 rounded-full
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red" />
              </span>
              National Coding Championship · {CONTEST_EDITION}
            </span>
          </motion.div>

          {/* ── Logo lockup above title ── */}
          <motion.div
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/logo.png"
              alt="CodeRush"
              width={80}
              height={80}
              className="h-16 w-auto object-contain drop-shadow-[0_0_24px_rgba(249,115,22,0.6)]"
              priority
            />
          </motion.div>

          {/* ── Giant split title ── */}
          <div className="flex flex-col items-center" style={{ perspective: "800px" }}>
            {HERO_TITLE_LINES.map((line, lineIdx) => (
              <motion.div
                key={line}
                className="flex overflow-hidden"
                variants={shouldReduceMotion ? {} : titleContainer}
                initial="hidden"
                animate="visible"
              >
                {line.split("").map((char, charIdx) => (
                  <motion.span
                    key={`${lineIdx}-${charIdx}`}
                    variants={shouldReduceMotion ? {} : letterVariant}
                    className="
                      font-sans font-black
                      text-[clamp(72px,14vw,180px)]
                      leading-none tracking-tighter
                      select-none
                    "
                    style={{
                      // Each letter gets a subtle flame-gradient colour split:
                      // "CODE" is pure white; "RUSH" picks up a warm orange tint
                      color: lineIdx === 0 ? "#FFFFFF" : "#FFFFFF",
                      textShadow:
                        lineIdx === 1
                          ? "0 0 80px rgba(249,115,22,0.5), 0 0 160px rgba(220,38,38,0.25)"
                          : "0 0 60px rgba(255,255,255,0.15)",
                      display: "inline-block",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </div>

          {/* ── Four brand-colour bars — animated in sequence under title ── */}
          <motion.div
            className="flex justify-center gap-2 mt-5 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            {[
              { color: "bg-brand-blue",   delay: 1.5  },
              { color: "bg-brand-yellow", delay: 1.65 },
              { color: "bg-brand-green",  delay: 1.8  },
              { color: "bg-brand-red",    delay: 1.95 },
            ].map(({ color, delay }) => (
              <motion.div
                key={color}
                className={`h-[3px] rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: 56 }}
                transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.div>

          {/* ── Tagline ── */}
          <motion.p
            className="
              text-center font-sans text-base sm:text-lg
              text-white/65 max-w-lg mx-auto px-6
              leading-relaxed mb-10
            "
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            A high-stakes programming contest built for engineers who think in edge cases.
            Rank on a live leaderboard. Compete for{" "}
            <span className="text-brand-yellow font-semibold">₹10,00,000+</span> in prizes.
          </motion.p>

          {/* ── Date + venue meta ── */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mb-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
              {CONTEST_DATES}
            </span>
            <span className="text-white/20 font-mono" aria-hidden="true">·</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
              {CONTEST_VENUE}
            </span>
          </motion.div>

          {/* ── CTA buttons ── */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 mb-14 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Primary */}
            <a
              href={UNSTOP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                bg-brand-blue hover:bg-brand-blue/90
                active:scale-[0.97]
                text-white font-mono text-sm font-medium
                rounded-md px-7 py-3.5
                shadow-lg shadow-brand-blue/30
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-white
                group
              "
            >
              Register on Unstop
              <ExternalLink
                size={13}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>

            {/* Secondary — frosted glass */}
            <a
              href="#about"
              className="
                inline-flex items-center gap-2
                bg-white/10 hover:bg-white/18
                backdrop-blur-sm
                border border-white/20 hover:border-white/35
                text-white font-mono text-sm
                rounded-md px-7 py-3.5
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-white
                group
              "
            >
              Explore Details
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>

          {/* ── Stats strip — frosted glass pill ── */}
          <motion.div
            className="flex justify-center px-4 mb-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="
                inline-grid grid-cols-2 sm:grid-cols-4
                gap-px
                rounded-2xl overflow-hidden
                border border-white/10
                bg-white/[0.06] backdrop-blur-md
              "
              role="list"
              aria-label="Contest statistics"
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  role="listitem"
                  className={`
                    flex flex-col items-center gap-1 px-8 py-5
                    ${i < STATS.length - 1 ? "border-r border-white/10 last:border-r-0" : ""}
                    ${i === 1 ? "border-r-0 sm:border-r border-white/10" : ""}
                  `}
                >
                  <AnimatedStat value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Quick facts bar — bottom frosted strip ── */}
          <motion.div
            className="mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="
                mx-4 mb-16 sm:mx-auto sm:max-w-3xl
                border border-white/10
                bg-white/[0.04] backdrop-blur-md
                rounded-2xl
                px-6 py-4
                grid grid-cols-2 sm:grid-cols-4 gap-4
              "
              aria-label="Quick contest details"
            >
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/35">
                    {fact.label}
                  </span>
                  <span className="font-sans text-xs font-medium text-white/80 leading-snug">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ── Scroll caret ── */}
        {!shouldReduceMotion && <ScrollCaret />}

        {/* ── Four-bar bottom accent (brand identity strip) ── */}
        <FourBarAccent />

      </section>
    </>
  );
}