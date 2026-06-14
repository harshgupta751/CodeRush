"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, useInView, AnimatePresence, Variants } from "framer-motion";
import {
  CheckCircle2,
  Utensils,
  Mic2,
  Trophy,
  Swords,
  Coffee,
  Moon,
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
  // Raw CSS colour value for inline styles (mouse spotlight, box-shadow)
  // Derived from the Tailwind token so we never hardcode a hex twice.
  accentRaw: string;
  featured: boolean;
  criteria: string[];
  note: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline data
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
// Eligibility tier data
// accentRaw is the CSS hex for inline styles (mouse-spotlight, box-shadow).
// All Tailwind accent classes remain unchanged from the original file.
// ─────────────────────────────────────────────────────────────────────────────

const ELIGIBILITY_TIERS: EligibilityTier[] = [
  {
    id: "internal",
    icon: GraduationCap,
    eyebrow: "KIET Students",
    title: "Internal\nParticipants",
    description:
      "Currently enrolled undergraduate or postgraduate students at KIET Group of Institutions, Ghaziabad.",
    accentBar:    "bg-brand-blue",
    accentText:   "text-brand-blue",
    accentBg:     "bg-brand-blue/5",
    accentBorder: "border-brand-blue/20",
    accentRaw:    "#1D4ED8",
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
    accentBar:    "bg-brand-yellow",
    accentText:   "text-brand-yellow",
    accentBg:     "bg-brand-yellow/5",
    accentBorder: "border-brand-yellow/20",
    accentRaw:    "#F59E0B",
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
    accentBar:    "bg-brand-green",
    accentText:   "text-brand-green",
    accentBg:     "bg-brand-green/5",
    accentBorder: "border-brand-green/20",
    accentRaw:    "#16A34A",
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
// Event type config
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<
  EventType,
  { dotColor: string; labelColor: string; label: string }
> = {
  contest:   { dotColor: "bg-brand-red",    labelColor: "text-brand-red",    label: "Contest"  },
  ceremony:  { dotColor: "bg-brand-blue",   labelColor: "text-brand-blue",   label: "Ceremony" },
  logistics: { dotColor: "bg-brand-yellow", labelColor: "text-brand-yellow", label: "Info"     },
  break:     { dotColor: "bg-slate-400",    labelColor: "text-slate-400",    label: "Break"    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants — Timeline (unchanged from original)
// ─────────────────────────────────────────────────────────────────────────────

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delaySeconds: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delaySeconds },
  }),
};

const dayHeaderVariant: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeading
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  centered?: boolean;
}

function SectionHeading({ eyebrow, heading, subheading, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest
                       text-brand-blue border border-brand-blue/20 bg-brand-blue/5
                       px-3 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight
                     text-brand-dark leading-[1.1]">
        {heading}
      </h2>
      <p className="mt-3 font-sans text-[15px] text-slate-500 leading-relaxed max-w-xl">
        {subheading}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineEventCard — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEventCardProps {
  event: TimelineEvent;
  side: "left" | "right";
  index: number;
  reducedMotion: boolean;
}

function TimelineEventCard({ event, side, index, reducedMotion }: TimelineEventCardProps) {
  const IconComponent = event.icon;
  const typeConfig    = EVENT_TYPE_CONFIG[event.type];

  return (
    <motion.div
      variants={reducedMotion ? {} : fadeUpVariant}
      custom={index * 0.07}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={`relative flex w-full
        ${side === "right"
          ? "md:justify-start md:pl-8 pl-10"
          : "md:justify-end md:pr-8 pl-10 md:pl-0"
        }`}
    >
      <div className="w-full md:w-[calc(50%-2rem)] bg-white border border-slate-200
                      rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm
                      transition-all duration-200 group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200
                            flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <IconComponent size={13} className="text-slate-500" strokeWidth={1.75} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              {event.time}
            </span>
          </div>
          <span className={`font-mono text-[9px] uppercase tracking-widest
                           px-2 py-0.5 rounded-full border
                           ${typeConfig.labelColor} border-current/20 bg-current/5`}>
            {typeConfig.label}
          </span>
        </div>
        <h4 className="font-sans text-sm font-semibold text-brand-dark leading-snug mb-1.5">
          {event.title}
        </h4>
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div
        className={`absolute top-5 left-[13px] md:left-1/2 -translate-x-1/2
                    w-3 h-3 rounded-full ${typeConfig.dotColor}
                    border-2 border-white z-10 ring-2 ring-offset-0
                    ${typeConfig.dotColor === "bg-brand-red"    ? "ring-brand-red/20"    : ""}
                    ${typeConfig.dotColor === "bg-brand-blue"   ? "ring-brand-blue/20"   : ""}
                    ${typeConfig.dotColor === "bg-brand-yellow" ? "ring-brand-yellow/20" : ""}
                    ${typeConfig.dotColor === "bg-slate-400"    ? "ring-slate-200"       : ""}
                   `}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DayHeader — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────

function DayHeader({ day, reducedMotion }: { day: TimelineDay; reducedMotion: boolean }) {
  return (
    <motion.div
      variants={reducedMotion ? {} : dayHeaderVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="relative flex justify-center my-8"
      aria-label={`Events on ${day.date}`}
    >
      <span
        className="pointer-events-none select-none absolute left-1/2 top-1/2
                   -translate-x-1/2 -translate-y-1/2 font-mono font-black
                   text-[64px] sm:text-[80px] leading-none text-slate-900
                   opacity-[0.03] whitespace-nowrap"
        aria-hidden="true"
      >
        {day.ghost}
      </span>
      <div className={`relative z-10 flex items-center gap-3 ${day.accentBg}
                       border ${day.accentBorder} rounded-full px-5 py-2.5`}>
        <span
          className={`w-2 h-2 rounded-full ${day.accentColor.replace("text-","bg-")} inline-block`}
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
// TimelineSection — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────

function TimelineSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="timeline"
      aria-label="Event Timeline"
      className="relative bg-white py-20 lg:py-28 overflow-hidden border-b border-slate-200/80"
    >
      <div
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)]
                   bg-[size:32px_32px] opacity-35"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
          <div className="mt-6 inline-flex flex-wrap justify-center items-center gap-4">
            {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(
              ([, config]) => (
                <span key={config.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${config.dotColor} inline-block`} aria-hidden="true" />
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${config.labelColor}`}>
                    {config.label}
                  </span>
                </span>
              )
            )}
          </div>
        </motion.div>

        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-slate-200 -translate-x-1/2"
            aria-hidden="true"
          />
          {TIMELINE_DAYS.map((day) => (
            <div key={day.date}>
              <DayHeader day={day} reducedMotion={reducedMotion} />
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
// EligibilityCard — REDESIGNED with 5 rich animations
//
// Animation 1: Entry — cards enter from different directions
//   Card 0 (internal):  slides in from LEFT  (x: -40)
//   Card 1 (external):  slides in from BELOW (y: 40) — featured, centre position
//   Card 2 (global):    slides in from RIGHT (x: +40)
//
// Animation 2: Accent top bar — wipes left→right on viewport entry
//   A motion.div inside a clipping container animates width 0→100%.
//   Feels like a "loading bar" activating the card.
//
// Animation 3: Icon badge — scale-pops in (0.5→1) with spring after card enters
//   Gives the icon a satisfying "stamp" arrival.
//
// Animation 4: Criteria checklist — items reveal one-by-one (staggered)
//   useEffect + setTimeout chain: 350ms initial delay, 85ms per item.
//   Each item animates opacity 0→1 and x -10→0 individually.
//   While revealing: three pulsing dots animate as a "loading" indicator.
//   CheckCircle2 icon itself springs in (scale 0→1, ease: backOut).
//
// Animation 5: Mouse-tracking spotlight + hover elevation
//   onMouseMove tracks cursor position → radial-gradient follows it.
//   Border transitions to accent colour on hover.
//   Box-shadow deepens on hover for tactile lift.
// ─────────────────────────────────────────────────────────────────────────────

function EligibilityCard({
  tier,
  index,
  reducedMotion,
}: {
  tier: EligibilityTier;
  index: number;
  reducedMotion: boolean;
}) {
  const IconComponent = tier.icon;

  // Hover state for spotlight + border/shadow transitions
  const [hovered, setHovered] = useState(false);
  // Mouse position as % of card dimensions — drives the radial spotlight
  const [mouse, setMouse]     = useState({ x: 50, y: 50 });
  // How many criteria items have been revealed so far
  const [criteriaVisible, setCriteriaVisible] = useState(0);

  const ref    = useRef<HTMLDivElement>(null);
  // Fire once when the card enters the viewport — triggers bar wipe + criteria reveal
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Animation 4 — staggered criteria reveal
  useEffect(() => {
    // If reduced motion, reveal all instantly; no animation
    if (!inView || reducedMotion) {
      setCriteriaVisible(tier.criteria.length);
      return;
    }
    if (criteriaVisible >= tier.criteria.length) return;
    const t = setTimeout(
      () => setCriteriaVisible((n) => n + 1),
      350 + criteriaVisible * 85       // 350ms initial hold, then 85ms per item
    );
    return () => clearTimeout(t);
  }, [inView, criteriaVisible, tier.criteria.length, reducedMotion]);

  // Animation 5 — mouse tracking
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left)  / r.width)  * 100,
      y: ((e.clientY - r.top)   / r.height) * 100,
    });
  }

  // Animation 1 — entry direction per card position
  const entryX = index === 0 ? -40 : index === 2 ? 40 : 0;
  const entryY = index === 1 ?  40 : 0;

  return (
    <motion.div
      ref={ref}
      // Animation 1: directional entry
      initial={{ opacity: 0, x: entryX, y: entryY, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      // Animation 5: mouse tracking handlers
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`
        relative flex flex-col rounded-2xl overflow-hidden bg-white
        transition-all duration-300
        ${tier.featured
          ? "shadow-sm ring-1 ring-slate-200"
          : ""
        }
      `}
      style={{
        // Animation 5: border colour transitions to accent on hover
        border: `1px solid ${
          hovered
            ? `${tier.accentRaw}50`
            : tier.featured
              ? "rgb(203 213 225)"   // slate-300
              : "rgb(226 232 240)"   // slate-200
        }`,
        // Animation 5: shadow deepens on hover, tinted with accent colour
        boxShadow: hovered
          ? `0 12px 40px ${tier.accentRaw}22, 0 4px 12px rgba(0,0,0,0.06)`
          : tier.featured
            ? "0 4px 16px rgba(0,0,0,0.07)"
            : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Animation 5: mouse-tracking radial spotlight
          Rendered only when hovered and reduced motion is off.
          The gradient centre follows the cursor in real time. */}
      {hovered && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%,
              ${tier.accentRaw}12 0%, transparent 62%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Animation 2: accent top bar wipe
          The outer div clips the inner motion.div so the wipe is clean.
          bg-slate-100 is the "track" colour before the bar fills. */}
      <div className="relative h-[3px] w-full overflow-hidden bg-slate-100" aria-hidden="true">
        <motion.div
          className={`absolute left-0 top-0 h-full ${tier.accentBar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ duration: 0.75, delay: index * 0.12 + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Card header ── */}
      <div
        className={`relative z-10 px-6 pt-6 pb-5 ${tier.accentBg}
                    transition-colors duration-300`}
      >
        {/* Featured badge — springs in after card entry */}
        {tier.featured && (
          <div className="flex justify-end mb-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.75 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.12 + 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className={`font-mono text-[9px] uppercase tracking-widest
                         ${tier.accentText} border ${tier.accentBorder}
                         px-2.5 py-0.5 rounded-full bg-white`}
            >
              Most Common
            </motion.span>
          </div>
        )}

        {/* Icon + eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          {/* Animation 3: icon badge scale-pops in with spring */}
          <motion.div
            className={`w-9 h-9 rounded-xl flex items-center justify-center
                        flex-shrink-0 bg-white border ${tier.accentBorder}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.45,
              delay: index * 0.12 + 0.18,
              ease: [0.34, 1.56, 0.64, 1],   // back-out spring — gives the "stamp" feel
            }}
            aria-hidden="true"
          >
            <IconComponent size={16} className={tier.accentText} strokeWidth={1.75} />
          </motion.div>

          <span className={`font-mono text-[10px] uppercase tracking-widest ${tier.accentText}`}>
            {tier.eyebrow}
          </span>
        </div>

        {/* Title — colour shifts to accent on hover */}
        <motion.h3
          className="font-sans text-xl font-bold tracking-tight leading-tight
                     whitespace-pre-line mb-2 transition-colors duration-300"
          animate={{ color: hovered ? tier.accentRaw : "#1E293B" }}
          transition={{ duration: 0.2 }}
        >
          {tier.title}
        </motion.h3>

        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          {tier.description}
        </p>
      </div>

      {/* Hairline */}
      <div className="h-px bg-slate-100" aria-hidden="true" />

      {/* ── Criteria checklist ── Animation 4 */}
      <div className="relative z-10 px-6 py-5 flex flex-col gap-3 flex-1">
        {tier.criteria.map((criterion, ci) => (
          <AnimatePresence key={criterion} initial={false}>
            {ci < criteriaVisible && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-2.5"
              >
                {/* CheckCircle2 springs in with backOut ease for a satisfying pop */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.28, delay: 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <CheckCircle2
                    size={15}
                    className={`${tier.accentText} flex-shrink-0 mt-0.5`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </motion.div>
                <span className="font-sans text-xs text-slate-600 leading-relaxed">
                  {criterion}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Pulsing dots while criteria are still revealing.
            Three dots staggered 200ms apart give a "typing…" feel.
            Hidden when all items are visible or reducedMotion is on. */}
        {criteriaVisible < tier.criteria.length && !reducedMotion && (
          <div className="flex items-center gap-1.5 h-4 mt-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${tier.accentBar}`}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 0.9, delay, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>

      {/* Hairline */}
      <div className="h-px bg-slate-100" aria-hidden="true" />

      {/* Footer note */}
      <div className="relative z-10 px-6 py-4">
        <p className={`font-mono text-[10px] uppercase tracking-widest
                       ${tier.accentText} leading-relaxed`}>
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
      {/* Top gradient wash */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-24
                   bg-gradient-to-b from-white/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        <motion.p
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0.35}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-10 text-center font-mono text-[10px] uppercase tracking-widest text-slate-400"
        >
          All participants must register on Unstop before 14th August 2026 · Late entries not accepted
        </motion.p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────────────────────

export default function TimelineEligibility() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <TimelineSection   reducedMotion={shouldReduceMotion} />
      <EligibilitySection reducedMotion={shouldReduceMotion} />
    </>
  );
}