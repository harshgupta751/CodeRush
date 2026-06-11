"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import {
  CheckCircle2,
  Utensils,
  Mic2,
  Trophy,
  Swords,
  Coffee,
  Moon,
  Sun,
  Music,
  Users,
  GraduationCap,
  Globe,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type EventType = "contest" | "logistics" | "ceremony" | "break";

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  type: EventType;
  icon: React.ElementType;
}

interface TimelineDay {
  date: string;
  shortDate: string;
  ghost: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  events: TimelineEvent[];
}

interface EligibilityTier {
  id: string;
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  accentBar: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  featured: boolean;
  criteria: string[];
  note: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline data — transcribed from the handwritten schedule image
// Day 1: 21st August 2026 | Day 2: 22nd August 2026
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_DAYS: TimelineDay[] = [
  {
    date: "21st August 2026",
    shortDate: "Aug 21",
    ghost: "DAY 1",
    accentColor: "text-brand-blue",
    accentBg: "bg-brand-blue/10",
    accentBorder: "border-brand-blue/30",
    events: [
      {
        time: "10:00 AM",
        title: "Registration",
        description:
          "On-site check-in for all participants. Collect your contestant kit, verify your credentials, and get assigned to your contest workstation inside the KIET lab block.",
        type: "logistics",
        icon: Users,
      },
      {
        time: "12:00 Noon",
        title: "Inaugural Ceremony",
        description:
          "Official opening of CodeRush Season IV. Remarks from the CPBYTE core committee, faculty coordinators, and guest speakers from the industry. Problem setters are introduced.",
        type: "ceremony",
        icon: Mic2,
      },
      {
        time: "1:00 PM – 2:00 PM",
        title: "Lunch",
        description:
          "Catered lunch for all registered participants and volunteers. Use this time to review the contest rules and settle into your environment before the first round begins.",
        type: "break",
        icon: Utensils,
      },
      {
        time: "2:00 PM – 5:00 PM",
        title: "Relay Race — Round 1",
        description:
          "The opening contest round. Teams tackle a mixed problem set spanning implementation, greedy, and introductory graph problems. All team members contribute to a shared submission queue.",
        type: "contest",
        icon: Zap,
      },
      {
        time: "6:00 PM – 8:00 PM",
        title: "Elimination (3v3) — 2 Rounds",
        description:
          "Head-to-head elimination bracket. Three-member teams compete directly against a rival squad. Two rounds run back-to-back; standings are locked at the end of the second round.",
        type: "contest",
        icon: Swords,
      },
      {
        time: "8:00 PM – 10:00 PM",
        title: "Dinner",
        description:
          "Dinner break for all participants. Leaderboard is paused and frozen during this window. Rankings as of 8 PM are displayed on the contest screen.",
        type: "break",
        icon: Utensils,
      },
      {
        time: "10:00 PM – 12:00 AM",
        title: "Elimination (3v1) — 2 Rounds",
        description:
          "Late-night high-pressure elimination format. One designated solver per team faces a curated set of hard problems solo. Two rounds determine who advances to Day 2.",
        type: "contest",
        icon: Moon,
      },
    ],
  },
  {
    date: "22nd August 2026",
    shortDate: "Aug 22",
    ghost: "DAY 2",
    accentColor: "text-brand-red",
    accentBg: "bg-brand-red/10",
    accentBorder: "border-brand-red/30",
    events: [
      {
        time: "12:00 AM – 2:00 AM",
        title: "Jamming Session",
        description:
          "Post-midnight unrated practice round. Open to all — advance or eliminated. A chance to work through problems collaboratively, discuss approaches, and wind down with fellow contestants.",
        type: "logistics",
        icon: Music,
      },
      {
        time: "7:00 AM – 8:00 AM",
        title: "Breakfast",
        description:
          "Morning meal for all overnight participants and incoming Day 2 attendees. Contest systems go live for final technical checks during this window.",
        type: "break",
        icon: Coffee,
      },
      {
        time: "9:00 AM – 12:00 Noon",
        title: "Javelin — Finals Sprint",
        description:
          "The main finals event. Top-advancing teams from Day 1 compete in CodeRush's flagship long-form round. Problems span advanced DP, segment trees, and combinatorics. Three hours, no hints.",
        type: "contest",
        icon: Zap,
      },
      {
        time: "12:00 Noon – 2:00 PM",
        title: "Lunch",
        description:
          "Midday break. Finals leaderboard is frozen at 12:00 Noon sharp. Participants can request editorial previews from problem setters during this period.",
        type: "break",
        icon: Utensils,
      },
      {
        time: "2:00 PM – 4:00 PM",
        title: "Speaker Session + Elimination (3v1)",
        description:
          "Parallel track: industry speaker session on competitive programming careers runs alongside the final Elimination (3v1) round for remaining bracket participants. Both run concurrently.",
        type: "contest",
        icon: Mic2,
      },
      {
        time: "4:00 PM – 5:00 PM",
        title: "Closing Ceremony + Felicitation",
        description:
          "Results announcement, rank reveal, and prize distribution for all ranked participants. Certificate handover, sponsor acknowledgements, and the official close of CodeRush Season IV.",
        type: "ceremony",
        icon: Trophy,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Eligibility tier data — 3 columns as specified
// ─────────────────────────────────────────────────────────────────────────────

const ELIGIBILITY_TIERS: EligibilityTier[] = [
  {
    id: "internal",
    icon: GraduationCap,
    eyebrow: "KIET Students",
    title: "Internal\nParticipants",
    description:
      "Currently enrolled undergraduate or postgraduate students at KIET Group of Institutions, Ghaziabad.",
    accentBar: "bg-brand-blue",
    accentText: "text-brand-blue",
    accentBg: "bg-brand-blue/5",
    accentBorder: "border-brand-blue/20",
    featured: false,
    criteria: [
      "Valid KIET student ID (any branch, any year)",
      "UG (B.Tech) or PG (M.Tech / MCA) enrollment",
      "Solo or team of up to 4 members",
      "No minimum CGPA requirement",
      "Registration via Unstop using college email",
      "On-site participation mandatory for finals",
    ],
    note: "Internal teams get priority seating in the KIET lab block for all rounds.",
  },
  {
    id: "external",
    icon: Users,
    eyebrow: "Other Universities",
    title: "External\nCandidates",
    description:
      "Students from any AICTE-recognised university or autonomous institution across India.",
    accentBar: "bg-brand-yellow",
    accentText: "text-brand-yellow",
    accentBg: "bg-brand-yellow/5",
    accentBorder: "border-brand-yellow/20",
    featured: true,
    criteria: [
      "Valid college or university student ID",
      "UG or PG students from any Indian institution",
      "Solo or team of up to 4 members",
      "Qualifier rounds are fully online",
      "Finals require travel to KIET, Ghaziabad",
      "Accommodation support available on request",
    ],
    note: "External finalists receive travel reimbursement up to ₹500 on submission of tickets.",
  },
  {
    id: "global",
    icon: Globe,
    eyebrow: "Open Category",
    title: "Global\nEnthusiasts",
    description:
      "Independent coders, working professionals, and international participants who want to compete on merit.",
    accentBar: "bg-brand-green",
    accentText: "text-brand-green",
    accentBg: "bg-brand-green/5",
    accentBorder: "border-brand-green/20",
    featured: false,
    criteria: [
      "No institutional affiliation required",
      "Open to all ages and backgrounds",
      "Solo participation only (no team entry)",
      "All rounds online — finals are hybrid",
      "Must have a verified Unstop account",
      "Prizes subject to on-site presence at finals",
    ],
    note: "Open category rankings are tracked separately. Top 3 receive special certificates.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Event type config — drives dot colour and label on each timeline node
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<
  EventType,
  { dotColor: string; labelColor: string; label: string }
> = {
  contest:   { dotColor: "bg-brand-red",    labelColor: "text-brand-red",    label: "Contest" },
  ceremony:  { dotColor: "bg-brand-blue",   labelColor: "text-brand-blue",   label: "Ceremony" },
  logistics: { dotColor: "bg-brand-yellow", labelColor: "text-brand-yellow", label: "Info" },
  break:     { dotColor: "bg-slate-400",    labelColor: "text-slate-400",    label: "Break" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

// Timeline event cards fade up with a custom delay
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delaySeconds: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: delaySeconds,
    },
  }),
};

// Eligibility cards scale in slightly from below
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.1,
    },
  }),
};

// Day header banner slides in from left
const dayHeaderVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeading — consistent with the rest of the page system
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  centered?: boolean;
}

function SectionHeading({
  eyebrow,
  heading,
  subheading,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
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
      <h2
        className="
          font-sans text-3xl sm:text-4xl font-bold tracking-tight
          text-brand-dark leading-[1.1]
        "
      >
        {heading}
      </h2>
      <p className="mt-3 font-sans text-[15px] text-slate-500 leading-relaxed max-w-xl">
        {subheading}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineEventCard
// Renders a single event on the left or right side of the spine.
// On mobile, all cards appear to the right (left-side layout is skipped).
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEventCardProps {
  event: TimelineEvent;
  side: "left" | "right";
  index: number;
  reducedMotion: boolean;
}

function TimelineEventCard({
  event,
  side,
  index,
  reducedMotion,
}: TimelineEventCardProps) {
  const IconComponent = event.icon;
  const typeConfig = EVENT_TYPE_CONFIG[event.type];

  return (
    <motion.div
      variants={reducedMotion ? {} : fadeUpVariant}
      custom={index * 0.07}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`
        relative flex w-full
        ${side === "right"
          ? "md:justify-start md:pl-8 pl-10"
          : "md:justify-end md:pr-8 pl-10 md:pl-0"
        }
      `}
    >
      {/* The card itself */}
      <div
        className={`
          w-full md:w-[calc(50%-2rem)]
          bg-white border border-slate-200 rounded-2xl p-5
          hover:border-slate-300 hover:shadow-sm
          transition-all duration-200
          group
        `}
      >
        {/* Top row: icon + type label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200
                         flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <IconComponent size={13} className="text-slate-500" strokeWidth={1.75} />
            </div>
            {/* Time pill */}
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {event.time}
            </span>
          </div>

          {/* Event type tag */}
          <span
            className={`
              font-mono text-[9px] uppercase tracking-widest
              px-2 py-0.5 rounded-full border
              ${typeConfig.labelColor}
              border-current/20
              bg-current/5
            `}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-sans text-sm font-semibold text-brand-dark leading-snug mb-1.5">
          {event.title}
        </h4>

        {/* Description */}
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Connector dot — sits on the spine line.
          Positioned absolute relative to the timeline row container,
          centred on the spine (left-4 on mobile, left-1/2 on desktop). */}
      <div
        className={`
          absolute top-5
          left-[13px] md:left-1/2
          -translate-x-1/2
          w-3 h-3 rounded-full
          ${typeConfig.dotColor}
          border-2 border-white
          z-10
          ring-2 ring-offset-0
          ${typeConfig.dotColor === "bg-brand-red"
            ? "ring-brand-red/20"
            : typeConfig.dotColor === "bg-brand-blue"
              ? "ring-brand-blue/20"
              : typeConfig.dotColor === "bg-brand-yellow"
                ? "ring-brand-yellow/20"
                : "ring-slate-200"
          }
        `}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DayHeader
// Full-width banner that interrupts the spine line between Day 1 and Day 2.
// Ghost text behind the label ties to the bento card language from AboutOverview.
// ─────────────────────────────────────────────────────────────────────────────

interface DayHeaderProps {
  day: TimelineDay;
  reducedMotion: boolean;
}

function DayHeader({ day, reducedMotion }: DayHeaderProps) {
  return (
    <motion.div
      variants={reducedMotion ? {} : dayHeaderVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative flex justify-center my-8"
      aria-label={`Events on ${day.date}`}
    >
      {/* Ghost date text — abstract typographic form behind the badge */}
      <span
        className="
          pointer-events-none select-none
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          font-mono font-black text-[64px] sm:text-[80px] leading-none
          text-slate-900 opacity-[0.03] whitespace-nowrap
        "
        aria-hidden="true"
      >
        {day.ghost}
      </span>

      {/* Badge */}
      <div
        className={`
          relative z-10
          flex items-center gap-3
          ${day.accentBg} border ${day.accentBorder}
          rounded-full px-5 py-2.5
        `}
      >
        <span
          className={`w-2 h-2 rounded-full ${day.accentColor.replace("text-", "bg-")} inline-block`}
          aria-hidden="true"
        />
        <span className={`font-mono text-xs font-semibold uppercase tracking-widest ${day.accentColor}`}>
          {day.date}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineSection
// ─────────────────────────────────────────────────────────────────────────────

function TimelineSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="timeline"
      aria-label="Event Timeline"
      className="relative bg-white py-20 lg:py-28 overflow-hidden border-b border-slate-200/80"
    >
      {/* Quiet dot-grid texture — consistent with About/Hero sections */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)]
          bg-[size:32px_32px] opacity-35
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-14 lg:mb-20"
        >
          <SectionHeading
            eyebrow="Event Schedule"
            heading="Two days. One leaderboard."
            subheading="Every minute of CodeRush Season IV — from registration to the closing felicitation ceremony."
            centered
          />

          {/* Legend — maps dot colours to event types */}
          <div className="mt-6 inline-flex flex-wrap justify-center items-center gap-4">
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(
              ([, config]) => (
                <span key={config.label} className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${config.dotColor} inline-block`}
                    aria-hidden="true"
                  />
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${config.labelColor}`}>
                    {config.label}
                  </span>
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* Timeline body — relative container holds the spine and all event rows */}
        <div className="relative">

          {/* Spine line — runs full height of the timeline body.
              On mobile: left-4 (aligns with dot left-[13px] / -translate-x-1/2 = 13 – 6 = 7px offset to centre on line).
              On desktop: left-1/2 (centred, alternating left/right cards). */}
          <div
            className="
              absolute top-0 bottom-0
              left-4 md:left-1/2
              w-0.5 bg-slate-200
              -translate-x-1/2
            "
            aria-hidden="true"
          />

          {/* Render each day group */}
          {TIMELINE_DAYS.map((day) => (
            <div key={day.date}>
              <DayHeader day={day} reducedMotion={reducedMotion} />

              {/* Event rows — alternate left/right on desktop */}
              <div className="flex flex-col gap-5">
                {day.events.map((event, eventIndex) => (
                  <TimelineEventCard
                    key={`${day.shortDate}-${event.time}`}
                    event={event}
                    side={eventIndex % 2 === 0 ? "right" : "left"}
                    index={eventIndex}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EligibilityCard
// One of three eligibility tier cards.
// Featured (external) card gets a brand-yellow top bar and slight elevation.
// ─────────────────────────────────────────────────────────────────────────────

interface EligibilityCardProps {
  tier: EligibilityTier;
  index: number;
  reducedMotion: boolean;
}

function EligibilityCard({ tier, index, reducedMotion }: EligibilityCardProps) {
  const IconComponent = tier.icon;

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariant}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`
        relative flex flex-col
        rounded-2xl border overflow-hidden
        bg-white
        transition-all duration-200
        hover:shadow-md hover:border-slate-300
        ${tier.featured
          ? "border-slate-300 shadow-sm ring-1 ring-slate-200"
          : "border-slate-200"
        }
      `}
    >
      {/* Accent top bar — explicit bg class, no runtime string manipulation */}
      <div className={`h-[3px] w-full ${tier.accentBar}`} aria-hidden="true" />

      {/* Card header */}
      <div className={`px-6 pt-6 pb-5 ${tier.accentBg}`}>

        {/* Featured badge */}
        {tier.featured && (
          <div className="flex justify-end mb-2">
            <span
              className={`
                font-mono text-[9px] uppercase tracking-widest
                ${tier.accentText} border ${tier.accentBorder}
                px-2.5 py-0.5 rounded-full bg-white
              `}
            >
              Most Common
            </span>
          </div>
        )}

        {/* Icon + eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`
              w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
              bg-white border ${tier.accentBorder}
            `}
            aria-hidden="true"
          >
            <IconComponent size={16} className={tier.accentText} strokeWidth={1.75} />
          </div>
          <span className={`font-mono text-[10px] uppercase tracking-widest ${tier.accentText}`}>
            {tier.eyebrow}
          </span>
        </div>

        {/* Title — whitespace-pre-line to honour the \n line break */}
        <h3 className="font-sans text-xl font-bold tracking-tight text-brand-dark leading-tight whitespace-pre-line mb-2">
          {tier.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Hairline divider */}
      <div className="h-px bg-slate-100" aria-hidden="true" />

      {/* Criteria checklist */}
      <div className="px-6 py-5 flex flex-col gap-3 flex-1">
        {tier.criteria.map((criterion) => (
          <div key={criterion} className="flex items-start gap-2.5">
            {/* Lucide CheckCircle2 — filled-style check icon as specified */}
            <CheckCircle2
              size={15}
              className={`${tier.accentText} flex-shrink-0 mt-0.5`}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="font-sans text-xs text-slate-600 leading-relaxed">
              {criterion}
            </span>
          </div>
        ))}
      </div>

      {/* Hairline divider */}
      <div className="h-px bg-slate-100" aria-hidden="true" />

      {/* Footer note */}
      <div className="px-6 py-4">
        <p className={`font-mono text-[10px] uppercase tracking-widest ${tier.accentText} leading-relaxed`}>
          Note
        </p>
        <p className="font-sans text-xs text-slate-500 mt-0.5 leading-relaxed">
          {tier.note}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EligibilitySection
// ─────────────────────────────────────────────────────────────────────────────

function EligibilitySection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="eligibility"
      aria-label="Eligibility"
      className="relative bg-slate-50 py-20 lg:py-28 overflow-hidden border-b border-slate-200/80"
    >
      {/* Top gradient wash — softens the hard edge from the section above */}
      <div
        className="
          pointer-events-none absolute top-0 left-0 right-0 h-24
          bg-gradient-to-b from-white/70 to-transparent
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12 lg:mb-16"
        >
          <SectionHeading
            eyebrow="Who Can Participate"
            heading="Open to all who can code."
            subheading="CodeRush Season IV welcomes participants across three categories — college students, external candidates, and independent coding enthusiasts worldwide."
            centered
          />
        </motion.div>

        {/* 3-column card grid — collapses to single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {ELIGIBILITY_TIERS.map((tier, tierIndex) => (
            <EligibilityCard
              key={tier.id}
              tier={tier}
              index={tierIndex}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0.35}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="
            mt-10 text-center
            font-mono text-[10px] uppercase tracking-widest text-slate-400
          "
        >
          All participants must register on Unstop before 14th August 2026 · Late entries not accepted
        </motion.p>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — co-located sections share the reducedMotion hook
// ─────────────────────────────────────────────────────────────────────────────

export default function TimelineEligibility() {
  // Respect OS-level "prefers-reduced-motion": swap all variants for {}
  // when the user has requested reduced animation in their system settings.
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <TimelineSection reducedMotion={shouldReduceMotion} />
      <EligibilitySection reducedMotion={shouldReduceMotion} />
    </>
  );
}