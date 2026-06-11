"use client";

import { useRef } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArrowRight, ExternalLink, Circle } from "lucide-react";
import {
  UNSTOP_HREF,
  CONTEST_EDITION,
  CONTEST_DATES,
  CONTEST_VENUE,
} from "@/lib/constants";

// ─── Constants ────────────────────────────────────────────────────────────────
// UNSTOP_HREF is imported from @/lib/constants — the single source of truth.

const CONTEST_META = {
  eyebrow: "National Coding Championship",
  title: "Code. Compete.\nConquer.",
  accentLine: CONTEST_EDITION,
  dates: CONTEST_DATES,
  location: CONTEST_VENUE,
  body: "A high-stakes programming contest built for engineers who think in edge cases. Solve problems that matter, rank on a live leaderboard, and compete for prizes worth over ₹10,00,000.",
  stats: [
    { value: "12,000+", label: "Registered" },
    { value: "₹10L",    label: "Prize Pool" },
    { value: "48 hrs",  label: "Final Sprint" },
    { value: "200+",    label: "Colleges" },
  ],
} as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const videoPanel: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-xl font-bold tracking-tight text-brand-dark leading-none">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
        {label}
      </span>
    </div>
  );
}

function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">
        Live Preview
      </span>
    </span>
  );
}

function VideoPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      variants={videoPanel}
      className="relative w-full"
      aria-label="Contest highlight reel"
    >
      {/* Terminal chrome bar */}
      <div
        className="
          flex items-center gap-1.5 px-3 py-2.5
          bg-slate-50 border border-b-0 border-slate-200
          rounded-t-xl
        "
        aria-hidden="true"
      >
        <Circle size={9} className="fill-red-400 text-red-400" />
        <Circle size={9} className="fill-amber-400 text-amber-400" />
        <Circle size={9} className="fill-emerald-400 text-emerald-400" />
        <span className="ml-2 font-mono text-[10px] text-slate-400 tracking-wide select-none">
          hero-stream.mp4
        </span>
      </div>

      {/* Video container */}
      <div className="relative border border-slate-200 overflow-hidden rounded-b-xl bg-slate-100">
        <video
          ref={videoRef}
          src="/assets/hero-stream.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="w-full h-full object-cover aspect-video block"
          aria-label="Contest highlight reel video"
        />

        {/* Subtle overlay gradient — deepens bottom edge so status bar reads */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Corner badge */}
        <div
          className="
            absolute top-3 right-3
            font-mono text-[10px] uppercase tracking-widest
            bg-white/90 backdrop-blur-sm border border-slate-200
            text-brand-blue px-2.5 py-1 rounded-full
          "
          aria-hidden="true"
        >
          Season IV
        </div>
      </div>

      {/* Status line beneath video */}
      <div
        className="
          mt-3 flex items-center justify-between
          px-1 font-mono text-[10px] uppercase tracking-widest text-slate-400
        "
        aria-hidden="true"
      >
        <LiveIndicator />
        <span>/assets/hero-stream.mp4 · 1920×1080</span>
      </div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // When reduced motion is preferred, skip stagger and just show content
  const resolvedContainer = shouldReduceMotion
    ? {}
    : containerVariants;
  const resolvedChild = shouldReduceMotion
    ? {}
    : fadeUp;

  return (
    <section
      className="
        relative bg-white overflow-hidden
        border-b border-slate-200/80
      "
      aria-label="Hero section"
    >
      {/* Subtle grid texture — only visible on white, very quiet */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)]
          bg-[size:40px_40px] opacity-60
        "
        aria-hidden="true"
      />

      {/* Radial glow anchored top-left — brand-blue at ~4% opacity */}
      <div
        className="
          pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px]
          rounded-full bg-brand-blue/[0.04] blur-3xl
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column: copy ── */}
          <motion.div
            variants={resolvedContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <motion.div variants={resolvedChild} className="mb-5">
              <span
                className="
                  inline-flex items-center gap-2
                  font-mono text-xs uppercase tracking-widest text-brand-blue
                  border border-brand-blue/20 bg-brand-blue/5
                  px-3 py-1.5 rounded-full
                "
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block"
                  aria-hidden="true"
                />
                {CONTEST_META.eyebrow}
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              variants={resolvedChild}
              className="
                font-sans text-5xl sm:text-6xl lg:text-[64px]
                font-bold tracking-tight text-brand-dark
                leading-[1.05] whitespace-pre-line mb-5
              "
            >
              {CONTEST_META.title}
            </motion.h1>

            {/* Accent line — dates + location */}
            <motion.div
              variants={resolvedChild}
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-6"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-brand-blue">
                {CONTEST_META.accentLine}
              </span>
              <span className="text-slate-300 font-mono text-xs" aria-hidden="true">
                /
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-brand-blue">
                {CONTEST_META.dates}
              </span>
              <span className="text-slate-300 font-mono text-xs" aria-hidden="true">
                /
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-brand-blue">
                {CONTEST_META.location}
              </span>
            </motion.div>

            {/* Body copy */}
            <motion.p
              variants={resolvedChild}
              className="
                text-slate-500 text-base sm:text-[17px] leading-relaxed
                font-sans max-w-[480px] mb-8
              "
            >
              {CONTEST_META.body}
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={resolvedChild}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              {/* Primary CTA */}
              <a
                href={UNSTOP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98]
                  text-white font-mono text-sm font-medium
                  rounded-md px-6 py-3
                  shadow-md shadow-brand-blue/20
                  transition-all duration-200
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-brand-blue
                "
              >
                Register on Unstop
                <ExternalLink size={13} strokeWidth={2.5} aria-hidden="true" />
              </a>

              {/* Secondary text CTA */}
              <a
                href="#overview"
                className="
                  inline-flex items-center gap-1.5
                  text-sm font-medium font-mono text-slate-600
                  hover:text-brand-blue transition-colors duration-150
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-brand-blue
                  rounded-sm px-1
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

            {/* Stats row */}
            <motion.div variants={resolvedChild}>
              {/* Hairline divider */}
              <div className="h-px bg-slate-100 mb-6" aria-hidden="true" />
              <div
                className="grid grid-cols-4 gap-4"
                role="list"
                aria-label="Contest statistics"
              >
                {CONTEST_META.stats.map((stat) => (
                  <div key={stat.label} role="listitem">
                    <StatPill value={stat.value} label={stat.label} />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right column: video panel ── */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeIn}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <VideoPanel />

            {/* Inline contest info card beneath video */}
            <motion.div
              variants={shouldReduceMotion ? {} : { ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.55 } } }}
              initial="hidden"
              animate="visible"
              className="
                mt-4 border border-slate-200 rounded-xl
                px-5 py-4 bg-slate-50/70
                grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4
              "
              aria-label="Quick contest details"
            >
              {[
                { label: "Format", value: "Individual + Team (2–4)" },
                { label: "Rounds", value: "Qualifier · Semi · Final" },
                { label: "Platform", value: "Unstop + Custom Judge" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brand-blue">
                    {item.label}
                  </span>
                  <span className="font-sans text-xs font-medium text-slate-700 leading-snug">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}