"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  { label: "Format",   value: "Solo · Team (2–4)"         },
  { label: "Rounds",   value: "Qualifier · Semi · Final"  },
  { label: "Platform", value: "Unstop + Custom Judge"     },
  { label: "Venue",    value: CONTEST_VENUE               },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Torch-spark particles — flame colours from the logo, float upward
// Deterministic LCG so SSR + client render are identical (no hydration diff)
// ─────────────────────────────────────────────────────────────────────────────

function generateSparks() {
  let seed = 42;
  function rand() {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  }
  const colours = [
    "#FDE68A","#FDBA74","#FB923C",
    "#F97316","#EA580C","#DC2626","#B91C1C",
  ];
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    style: {
      width:           2 + rand() * 5,
      height:          2 + rand() * 5,
      left:            `${5 + rand() * 90}%`,
      bottom:          `${75 + rand() * 20}%`,
      backgroundColor: colours[Math.floor(rand() * colours.length)],
      boxShadow:       `0 0 ${(2 + rand() * 5) * 2}px ${colours[Math.floor(rand() * colours.length)]}`,
      opacity:         0,
      animation:       `spark-float ${2.5 + rand() * 3}s ${rand() * 4}s ease-in infinite`,
    } as React.CSSProperties,
  }));
}
const SPARKS = generateSparks();

// ─────────────────────────────────────────────────────────────────────────────
// Title animation — per-character spring flip
// ─────────────────────────────────────────────────────────────────────────────

const titleContainer = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.045, delayChildren: 0.35 } },
};
const letterVariant = {
  hidden:  { opacity: 0, y: 64, rotateX: -40 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { type: "spring" as const, stiffness: 180, damping: 18, mass: 0.8 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter — counts up on viewport entry
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const [started, setStarted]   = useState(false);
  const [display, setDisplay]   = useState("0");
  const ref                      = useRef<HTMLDivElement>(null);
  const rafRef                   = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }
    const prefix = value.startsWith("₹") ? "₹" : "";
    const suffix = value.replace(/[₹0-9,.]/g, "").trim();
    const hasComma = value.includes(",");
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 1600, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const c = Math.floor(e * num);
      setDisplay(`${prefix}${hasComma && c >= 1000 ? c.toLocaleString("en-IN") : c}${suffix}`);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="font-mono text-2xl sm:text-3xl font-bold text-white leading-none tabular-nums">
        {started ? display : "0"}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/55">
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScrollCaret
// ─────────────────────────────────────────────────────────────────────────────

function ScrollCaret() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.6 }}
      aria-hidden="true"
    >
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Scroll</span>
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
// FourBarAccent — bottom edge brand strip
// ─────────────────────────────────────────────────────────────────────────────

function FourBarAccent() {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex z-20" aria-hidden="true">
      {[
        { color: "bg-brand-blue",   delay: 0.8  },
        { color: "bg-brand-yellow", delay: 0.95 },
        { color: "bg-brand-green",  delay: 1.1  },
        { color: "bg-brand-red",    delay: 1.25 },
      ].map(({ color, delay }) => (
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
// Light "Coding Olympics" theme — video stays cinematic but overlay is now
// a warm light wash instead of a dark crush. Title is dark slate on the
// brightened video. Stats and info cards use white/light frosted glass.
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <style>{`
        @keyframes spark-float {
          0%   { opacity: 0;   transform: translateY(0)     scale(1);   }
          10%  { opacity: 0.9;                                           }
          60%  { opacity: 0.6; transform: translateY(-80px) scale(0.8); }
          100% { opacity: 0;   transform: translateY(-140px) scale(0.3);}
        }
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.4;  transform: scale(1);    }
          50%       { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes scanline-light {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <section
        className="relative w-full min-h-screen overflow-hidden"
        style={{ backgroundColor: "#0F172A" }}
        aria-label="Hero section"
      >

        {/* ── LAYER 1: Full-bleed video ──
            New video: hero-bg.mp4 (attached cinematic shot)
            Fallback: hero-stream.mp4
            object-cover fills the entire viewport at any aspect ratio.    */}
        <div className="absolute inset-0 z-0">
          <video
            src="/assets/hero-stream.mp4"
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />

          {/* Dark cinematic overlay — video clearly visible in the mid zone.
              Top: darker so navbar + eyebrow pill read cleanly.
              Mid (35–65%): lightest — this is where the video breathes through.
              Bottom: heavy dark so white frosted cards and stats pop against it.
              This is the correct production approach for a dark hero video. */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom," +
                "rgba(0,0,0,0.60) 0%," +
                "rgba(0,0,0,0.35) 30%," +
                "rgba(0,0,0,0.28) 55%," +
                "rgba(0,0,0,0.65) 80%," +
                "rgba(0,0,0,0.85) 100%)",
            }}
          />
        </div>

        {/* ── LAYER 2: Ambient colour orbs — dark context versions ── */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {/* Brand-blue glow — top-left */}
          <div
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(29,78,216,0.25) 0%, transparent 65%)",
              animation:  "hero-glow-pulse 6s ease-in-out infinite",
            }}
          />
          {/* Torch flame warmth — bottom-right */}
          <div
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 65%)",
              animation:  "hero-glow-pulse 7s 1.5s ease-in-out infinite",
            }}
          />
          {/* Gold accent — top-right */}
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%)",
              animation:  "hero-glow-pulse 8s 0.8s ease-in-out infinite",
            }}
          />
        </div>

        {/* ── LAYER 3: Scanline (subtle light shimmer) ── */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
          <div style={{
            position: "absolute", left: 0, right: 0, height: "1px",
            background: "linear-gradient(to right, transparent, rgba(29,78,216,0.08), transparent)",
            animation: "scanline-light 10s linear infinite",
          }} />
        </div>

        {/* ── LAYER 4: Spark particles ── */}
        {!shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {SPARKS.map((s) => (
              <span key={s.id} className="absolute rounded-full pointer-events-none" style={s.style} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* ── LAYER 5: Main content ── */}
        <div className="relative z-30 flex flex-col min-h-screen">

          {/* Eyebrow pill */}
          <motion.div
            className="flex justify-center pt-28 pb-6"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest
                         px-4 py-2 rounded-full backdrop-blur-sm"
              style={{
                color:      "rgba(255,255,255,0.80)",
                border:     "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" aria-hidden="true" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red" aria-hidden="true" />
              </span>
              National Coding Championship · {CONTEST_EDITION}
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/assets/logo.png"
              alt="CodeRush"
              width={80} height={80} priority
              className="h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(249,115,22,0.45)]"
            />
          </motion.div>

          {/* Giant title — dark text on light-washed video */}
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
                    className="font-sans font-black leading-none tracking-tighter select-none inline-block"
                    style={{
                      fontSize: "clamp(72px, 14vw, 180px)",
                      // Pure white — reads perfectly on dark video overlay
                      color: "#FFFFFF",
                      textShadow:
                        lineIdx === 1
                          ? "0 0 80px rgba(249,115,22,0.45), 0 2px 0 rgba(0,0,0,0.3)"
                          : "0 2px 0 rgba(0,0,0,0.2)",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Four brand bars */}
          <motion.div
            className="flex justify-center gap-2 mt-4 mb-7"
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

          {/* Tagline */}
          <motion.p
            className="text-center font-sans text-base sm:text-lg leading-relaxed mb-9 max-w-lg mx-auto px-6"
            style={{ color: "rgba(255,255,255,0.75)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            A high-stakes programming contest built for engineers who think in edge cases.
            Rank on a live leaderboard. Compete for{" "}
            <span className="text-brand-yellow font-semibold">₹10,00,000+</span> in prizes.
          </motion.p>

          {/* Date + venue */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mb-9 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/55">
              {CONTEST_DATES}
            </span>
            <span className="text-white/25 font-mono" aria-hidden="true">·</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/55">
              {CONTEST_VENUE}
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 mb-12 px-4"
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
                bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.97]
                text-white font-mono text-sm font-medium
                rounded-md px-7 py-3.5
                shadow-lg shadow-brand-blue/25
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-brand-blue
                group
              "
            >
              Register on Unstop
              <ExternalLink size={13} strokeWidth={2.5} aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#about"
              className="
                inline-flex items-center gap-2
                backdrop-blur-sm
                font-mono text-sm text-white/85
                rounded-md px-7 py-3.5
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-white
                group
              "
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
              }}
            >
              Explore Details
              <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true"
                className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* Stats strip — white frosted cards */}
          <motion.div
            className="flex justify-center px-4 mb-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="inline-grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
              style={{
                border:          "1px solid rgba(255,255,255,0.12)",
                background:      "rgba(255,255,255,0.07)",
                backdropFilter:  "blur(16px)",
              }}
              role="list"
              aria-label="Contest statistics"
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  role="listitem"
                  className={`
                    flex flex-col items-center gap-1 px-8 py-5
                    ${i < STATS.length - 1 ? "border-r last:border-r-0" : ""}
                    ${i === 1 ? "border-r-0 sm:border-r" : ""}
                  `}
                  style={{ borderColor: "rgba(255,255,255,0.10)" }}
                >
                  <AnimatedStat value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick facts bar */}
          <motion.div
            className="mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="mx-4 mb-16 sm:mx-auto sm:max-w-3xl rounded-2xl px-6 py-4
                         grid grid-cols-2 sm:grid-cols-4 gap-4"
              style={{
                background:     "rgba(0,0,0,0.30)",
                border:         "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
              aria-label="Quick contest details"
            >
              {QUICK_FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/45">
                    {fact.label}
                  </span>
                  <span className="font-sans text-xs font-semibold leading-snug text-white/85">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll caret */}
        {!shouldReduceMotion && <ScrollCaret />}

        {/* Four-bar bottom accent */}
        <FourBarAccent />

      </section>
    </>
  );
}