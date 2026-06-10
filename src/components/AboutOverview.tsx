"use client";

import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  Code2,
  Trophy,
  BarChart2,
  Globe,
  Cpu,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Content data
// All copy lives here — JSX stays purely structural.
// ─────────────────────────────────────────────────────────────────────────────

const ABOUT_CONTENT = {
  eyebrow: "About CodeRush",
  heading: "Built by engineers,\nfor engineers.",
  paragraphs: [
    "CodeRush is the flagship competitive programming contest organised by CPBYTE — the official coding community of KIET Group of Institutions, Ghaziabad. Since its inception, CodeRush has grown into one of North India's most anticipated annual contests, drawing participants from over 200 colleges across the country.",
    "The contest is designed to push participants beyond textbook algorithms. Every problem set is crafted by a core committee of competitive programmers with national-level credentials, ensuring a balanced but unforgiving difficulty curve — from warm-up implementation tasks to multi-concept hard problems that reward creative thinking.",
    "Whether you are grinding your first contest or chasing a national rank, CodeRush gives you a real arena: strict time limits, live rankings, anti-cheat judging, and finals held on campus with cash prizes on the line.",
  ],
  meta: [
    { label: "Organised by", value: "CPBYTE — KIET" },
    { label: "Edition",       value: "Season IV · 2025" },
    { label: "Mode",          value: "Online + Offline Finals" },
    { label: "Eligibility",   value: "UG / PG Students (All India)" },
  ],
} as const;

// BUG FIX: accent colours stored as explicit bg-* classes so no string
// manipulation is needed at render time. Previously the component tried to
// derive bg-brand-yellow from "border-brand-yellow" via .replace() which
// silently produced an invalid class name and left accent bars colourless.
//
// BUG FIX: opacity modifier changed from /8 → /10 throughout.
// Tailwind v4 only resolves standard opacity steps; /8 produced no output.
//
// LAYOUT FIX: card order is wide → narrow → narrow → wide so that CSS grid
// auto-placement produces the intended rhythm:
//   Row 1: [02 leaderboard ────── col-span-2 ──────]
//   Row 2: [01 problems · 1col] [04 bracket · 1col]
//   Row 3: [03 prizes ───────── col-span-2 ──────]
// This gives a visually bracketed structure: wide / split / wide.
const BENTO_CARDS = [
  {
    id: "leaderboard",
    ghost: "01",
    accentBar: "bg-brand-green",
    iconBg: "bg-brand-green/10",
    iconColor: "text-brand-green",
    Icon: BarChart2,
    metric: "<200ms",
    metricLabel: "leaderboard refresh",
    title: "Rankings via Live Leaderboard",
    description:
      "A real-time ranked scoreboard updates continuously during the contest. Penalty time, partial scoring, and tiebreakers mirror ICPC-style rules — no ambiguity, no delays.",
    wide: true,
  },
  {
    id: "problems",
    ghost: "02",
    accentBar: "bg-brand-yellow",
    iconBg: "bg-brand-yellow/10",
    iconColor: "text-brand-yellow",
    Icon: Code2,
    metric: "10+",
    metricLabel: "problems per round",
    title: "Complex DSA Problem Sets",
    description:
      "Every round features problems spanning graphs, dynamic programming, segment trees, and combinatorics — curated to separate ranks, not pad solve counts.",
    wide: false,
  },
  {
    id: "bracket",
    ghost: "03",
    accentBar: "bg-brand-red",
    iconBg: "bg-brand-red/10",
    iconColor: "text-brand-red",
    Icon: Globe,
    metric: "200+",
    metricLabel: "colleges competing",
    title: "Global Bracket Competition",
    description:
      "Qualifier rounds are open to all. Top performers advance to a live on-campus final at KIET, competing in a bracketed elimination format.",
    wide: false,
  },
  {
    id: "prizes",
    ghost: "04",
    accentBar: "bg-brand-blue",
    iconBg: "bg-brand-blue/10",
    iconColor: "text-brand-blue",
    Icon: Trophy,
    metric: "₹10L+",
    metricLabel: "total prize pool",
    title: "Cash Prizes and Recognition",
    description:
      "Top finishers take home cash awards, certificates, and sponsor swag. Shortlisted participants receive direct referrals to hiring partners.",
    wide: true,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

// Fade-up variant used for About section copy blocks.
// `custom` receives a delay in seconds so each block staggers independently
// without needing a parent container variant.
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delaySeconds: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: delaySeconds,
    },
  }),
};

// Bento card variant — `custom` receives the card array index.
// Delay is index × 80ms so the four cards cascade as a single wave.
const bentoCardVariant: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.08,
    },
  }),
};

// Image panel slides in from the right while copy fades up from the left.
const imageSlideVariant: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SectionDivider
// A four-colour bar using the brand accent strip from the logo.
// Sits between the About and Overview sections so the transition is deliberate
// rather than an invisible bg-white → bg-slate-50 step.
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="flex w-full h-[3px]" aria-hidden="true">
      <div className="flex-1 bg-brand-blue" />
      <div className="flex-1 bg-brand-yellow" />
      <div className="flex-1 bg-brand-green" />
      <div className="flex-1 bg-brand-red" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeading — reused by both About and Overview
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  centered?: boolean;
}

function SectionHeading({ eyebrow, heading, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      {/* Eyebrow pill — font-mono uppercase tracking, brand-blue, matches Hero */}
      <span
        className="
          inline-flex items-center gap-2
          font-mono text-xs uppercase tracking-widest text-brand-blue
          border border-brand-blue/20 bg-brand-blue/5
          px-3 py-1.5 rounded-full mb-4
        "
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block"
          aria-hidden="true"
        />
        {eyebrow}
      </span>

      {/* Heading — font-sans Extra Bold, brand-dark, tight leading */}
      <h2
        className="
          font-sans text-3xl sm:text-4xl font-bold tracking-tight
          text-brand-dark leading-[1.1] whitespace-pre-line
        "
      >
        {heading}
      </h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AboutSection
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="about"
      aria-label="About CodeRush"
      className="relative bg-white py-20 lg:py-28 overflow-hidden"
    >
      {/* Quiet radial dot grid — same visual language as Hero section */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)]
          bg-[size:32px_32px] opacity-40
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: copy column ── */}
          <div className="flex flex-col gap-6">

            {/* Section heading */}
            <motion.div
              variants={reducedMotion ? {} : fadeUpVariant}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <SectionHeading
                eyebrow={ABOUT_CONTENT.eyebrow}
                heading={ABOUT_CONTENT.heading}
              />
            </motion.div>

            {/* Body paragraphs — staggered at 100ms intervals */}
            {ABOUT_CONTENT.paragraphs.map((paragraph, paragraphIndex) => (
              <motion.p
                key={paragraphIndex}
                variants={reducedMotion ? {} : fadeUpVariant}
                custom={0.1 + paragraphIndex * 0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="font-sans text-[15px] leading-relaxed text-slate-500 max-w-[520px]"
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Meta key/value grid */}
            <motion.div
              variants={reducedMotion ? {} : fadeUpVariant}
              custom={0.4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-2"
            >
              {/* Hairline rule */}
              <div className="h-px bg-slate-100 mb-5" aria-hidden="true" />

              <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
                {ABOUT_CONTENT.meta.map((metaItem) => (
                  <div key={metaItem.label} className="flex flex-col gap-0.5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-brand-blue">
                      {metaItem.label}
                    </dt>
                    <dd className="font-sans text-sm font-semibold text-slate-700">
                      {metaItem.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Community callout card */}
            <motion.div
              variants={reducedMotion ? {} : fadeUpVariant}
              custom={0.5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="
                mt-1 flex items-start gap-3
                border border-slate-200 rounded-xl px-4 py-4
                bg-slate-50
              "
            >
              <div
                className="
                  flex-shrink-0 w-8 h-8 rounded-lg
                  bg-brand-blue/10 flex items-center justify-center
                "
                aria-hidden="true"
              >
                <Users size={15} className="text-brand-blue" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand-blue mb-0.5">
                  Community-Driven
                </p>
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                  CPBYTE runs free weekly practice contests, editorial sessions, and
                  mentorship circles year-round — CodeRush is the culmination of that
                  entire calendar.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: image column ── */}
          <motion.div
            variants={reducedMotion ? {} : imageSlideVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full"
          >
            {/* Offset decorative frame — sits 14px behind and below the image,
                giving depth without box-shadow and without a third DOM element */}
            <div
              className="
                absolute top-4 left-4 w-full h-full
                border border-brand-blue/20 rounded-2xl
              "
              aria-hidden="true"
            />

            {/* Primary image frame */}
            <div
              className="
                relative z-10 rounded-2xl overflow-hidden
                border border-slate-200 bg-slate-100
              "
            >
              <Image
                src="/assets/about-contest.jpg"
                alt="Participants at a previous CodeRush finals — students at laptops inside KIET's contest hall"
                width={720}
                height={480}
                quality={90}
                priority={false}
                className="w-full h-full object-cover block"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Caption bar — glassmorphism overlay at the bottom of the image */}
              <div
                className="
                  absolute bottom-0 left-0 right-0
                  bg-white/90 backdrop-blur-sm
                  border-t border-slate-200/80
                  px-4 py-3 flex items-center justify-between
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-6 h-6 rounded-md bg-brand-blue/10
                      flex items-center justify-center flex-shrink-0
                    "
                    aria-hidden="true"
                  >
                    <Cpu size={12} className="text-brand-blue" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
                    CodeRush Finals · KIET Campus
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-blue">
                  Season III
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BentoCard
// ─────────────────────────────────────────────────────────────────────────────

interface BentoCardProps {
  card: (typeof BENTO_CARDS)[number];
  index: number;
  reducedMotion: boolean;
}

function BentoCard({ card, index, reducedMotion }: BentoCardProps) {
  const IconComponent = card.Icon;

  return (
    <motion.article
      variants={reducedMotion ? {} : bentoCardVariant}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`
        relative flex flex-col justify-between
        rounded-2xl border border-slate-200
        overflow-hidden bg-white
        p-6 sm:p-7
        ${card.wide ? "md:col-span-2" : "md:col-span-1"}
        hover:border-slate-300 hover:shadow-sm
        transition-all duration-200
      `}
      aria-label={card.title}
    >
      {/* Accent top border — explicit bg-* class stored in data, no runtime
          string manipulation. Previously derived via .replace() which silently
          failed and left all accent bars invisible. */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${card.accentBar}`}
        aria-hidden="true"
      />

      {/* Ghost numeral — structural because each card is a discrete metric.
          Massive font size makes it an abstract form, not a label. */}
      <span
        className="
          pointer-events-none select-none
          absolute bottom-2 right-4
          font-mono font-black text-[96px] leading-none
          text-slate-900 opacity-[0.035]
        "
        aria-hidden="true"
      >
        {card.ghost}
      </span>

      {/* Card content sits above ghost numeral */}
      <div className="relative z-10 flex flex-col gap-4 h-full">

        {/* Top row: icon badge (left) + metric (right) */}
        <div className="flex items-start justify-between gap-4">

          {/* Icon badge */}
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${card.iconBg}
            `}
            aria-hidden="true"
          >
            <IconComponent size={18} className={card.iconColor} strokeWidth={1.75} />
          </div>

          {/* Metric + sublabel */}
          <div className="text-right">
            <p className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark leading-none">
              {card.metric}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-1">
              {card.metricLabel}
            </p>
          </div>
        </div>

        {/* Card title */}
        <h3 className="font-sans text-base font-semibold text-brand-dark leading-snug">
          {card.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-sm text-slate-500 leading-relaxed flex-1">
          {card.description}
        </p>

      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OverviewSection
// ─────────────────────────────────────────────────────────────────────────────

function OverviewSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="overview"
      aria-label="Contest Overview"
      className="relative bg-slate-50 py-20 lg:py-28 overflow-hidden"
    >
      {/* Gradient wash softens the hard edge from the SectionDivider above */}
      <div
        className="
          pointer-events-none absolute top-0 left-0 right-0 h-24
          bg-gradient-to-b from-white/60 to-transparent
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Centered section heading */}
        <motion.div
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 lg:mb-16"
        >
          <SectionHeading
            eyebrow="What to Expect"
            heading={"Everything a competitive\nprogrammer needs."}
            centered
          />
          <p className="mt-4 font-sans text-[15px] text-slate-500 leading-relaxed max-w-xl mx-auto">
            Four pillars that make CodeRush a complete contest experience — not
            just another online round.
          </p>
        </motion.div>

        {/* Bento grid
            Layout on md+ (2-col grid):
              Row 1: [leaderboard ─────────── col-span-2 ────────────]
              Row 2: [problems · col-span-1]  [bracket · col-span-1]
              Row 3: [prizes ─────────────── col-span-2 ────────────]
            This wide / split / wide cadence brackets the two narrow cards
            and gives the grid a deliberate, non-generic rhythm. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {BENTO_CARDS.map((card, cardIndex) => (
            <BentoCard
              key={card.id}
              card={card}
              index={cardIndex}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Footer attestation line */}
        <motion.p
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0.4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="
            mt-10 text-center
            font-mono text-[10px] uppercase tracking-widest text-slate-400
          "
        >
          All rounds judged on a custom online judge · Plagiarism detection enabled
        </motion.p>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// Both sections are co-located to share useReducedMotion, variants, and the
// SectionDivider without prop-drilling or a separate context provider.
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutOverview() {
  // Respect OS-level "prefers-reduced-motion". When true, all motion variants
  // are swapped for empty objects ({}) so content renders at its final state
  // with no animation — no layout shift, no timing issues.
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <AboutSection reducedMotion={shouldReduceMotion} />

      {/* Four-colour divider echoes the brand accent strip from the logo,
          making the section break a deliberate brand moment rather than
          a hairline border the eye glosses over. */}
      <SectionDivider />

      <OverviewSection reducedMotion={shouldReduceMotion} />
    </>
  );
}