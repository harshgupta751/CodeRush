"use client";

import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
} from "framer-motion";
import {
  Plus,
  X,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import {
  UNSTOP_HREF,
  ORGANISER_NAME,
  CONTEST_EDITION,
  CONTEST_DATES,
  CONTEST_VENUE,
  REGISTRATION_DEADLINE,
} from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// UNSTOP_HREF and contest metadata are imported from @/lib/constants.
// ─────────────────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

// ─────────────────────────────────────────────────────────────────────────────
// Sponsor data
// Each sponsor carries a tier which maps to a focus colour on hover.
// Grayscale → sharp colour is the transition as specified.
// Tiers deliberately use the four brand accent tokens for consistency.
// ─────────────────────────────────────────────────────────────────────────────

type SponsorTier = "platinum" | "gold" | "silver" | "community";

interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  href: string;
}

const SPONSOR_TIER_COLORS: Record<SponsorTier, string> = {
  platinum:  "hover:text-brand-blue   hover:border-brand-blue/40   hover:bg-brand-blue/5",
  gold:      "hover:text-brand-yellow hover:border-brand-yellow/40 hover:bg-brand-yellow/5",
  silver:    "hover:text-brand-green  hover:border-brand-green/40  hover:bg-brand-green/5",
  community: "hover:text-brand-red    hover:border-brand-red/40    hover:bg-brand-red/5",
};

const SPONSORS: Sponsor[] = [
  { id: "techcorp",     name: "TechCorp",      tier: "platinum",  href: "#" },
  { id: "devscale",     name: "DevScale",      tier: "gold",      href: "#" },
  { id: "algofunds",    name: "AlgoFunds",     tier: "platinum",  href: "#" },
  { id: "codebase",     name: "CodeBase",      tier: "silver",    href: "#" },
  { id: "stackventure", name: "StackVenture",  tier: "gold",      href: "#" },
  { id: "nullpointer",  name: "NullPointer",   tier: "community", href: "#" },
  { id: "bytebridge",   name: "ByteBridge",    tier: "silver",    href: "#" },
  { id: "loopworks",    name: "LoopWorks",     tier: "gold",      href: "#" },
  { id: "compilehq",    name: "CompileHQ",     tier: "platinum",  href: "#" },
  { id: "runtimeco",    name: "RuntimeCo",     tier: "community", href: "#" },
];

// The marquee needs duplicated items to create a seamless infinite loop.
// We duplicate 3× so even on very wide screens the track never shows a gap.
const MARQUEE_TRACK_ROW_1 = [...SPONSORS, ...SPONSORS, ...SPONSORS];
const MARQUEE_TRACK_ROW_2 = [...SPONSORS, ...SPONSORS, ...SPONSORS].reverse();

// ─────────────────────────────────────────────────────────────────────────────
// FAQ data — four practical questions as specified
// ─────────────────────────────────────────────────────────────────────────────

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "team-sizing",
    question: "What is the allowed team size for CodeRush?",
    answer:
      "Teams can have between 1 and 4 members. Solo participation is fully supported across all rounds including the finals. For the Elimination (3v3) bracket format specifically, teams of exactly 3 are matched against each other — if your team has 2 or 4 members, the contest system will auto-balance by assigning a substitute from the waiting pool or splitting the team for that round only. Your overall leaderboard rank is always attributed to your registered team composition, not the bracket assignment.",
  },
  {
    id: "code-environments",
    question: "Which languages and environments are supported?",
    answer:
      "The online judge supports C (GCC 11), C++ 17, C++ 20, Python 3.11, Java 17, and Kotlin 1.9. All submissions are evaluated in an isolated sandbox with strict memory (256 MB) and time limits defined per problem. You may use your own laptop during on-site finals — no IDE restrictions are imposed. Internet access is blocked on the contest network during active rounds. Local compilers are permitted; cloud-based AI coding assistants (GitHub Copilot, Tabnine, etc.) are explicitly prohibited and trigger an automatic disqualification.",
  },
  {
    id: "platform-rules",
    question: "What are the key rules around the Unstop platform?",
    answer:
      "Registration, qualifier submission, and all communications happen through Unstop. Each participant must register with a verified Unstop account linked to a valid email address. A single Unstop account may only be associated with one team — creating multiple accounts for a single participant is a bannable offence. Contest problems are hosted on CodeRush's custom judge and linked from inside the Unstop event page at the start of each round. Scores sync back to Unstop for ranking purposes. Any dispute about scoring must be raised through the Unstop grievance portal within 30 minutes of the round ending.",
  },
  {
    id: "entry-fees",
    question: "Is there an entry fee to participate in CodeRush?",
    answer:
      "CodeRush Season IV is completely free to enter for all participants across all three eligibility categories — internal KIET students, external university candidates, and global open category entrants. There are no registration fees, processing charges, or hidden costs at any stage including the on-site finals. Accommodation at KIET campus for outstation finalists is available on a first-come-first-served basis at no cost; travel is the participant's responsibility (partial reimbursement available for external finalists — see the Eligibility section for details).",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Footer navigation data
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_NAV_LINKS = [
  { label: "About",       href: "#about" },
  { label: "Timeline",    href: "#timeline" },
  { label: "Overview",    href: "#overview" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Sponsors",    href: "#sponsors" },
  { label: "FAQ",         href: "#faq" },
] as const;

// lucide-react (v0.383.0) does not export social brand icons.
// Substitutes used:
//   GitHub    → GitBranch  (version control / code context)
//   Instagram → Camera     (closest visual metaphor for photo platform)
//   LinkedIn  → Linkedin   (available in this version as "Linkedin")
//   Twitter/X → Twitter    (available in this version as "Twitter")
const FOOTER_SOCIAL_LINKS = [
  { label: "GitHub",    href: "https://github.com/cpbyte-kiet",      Icon: FaGithub      },
  { label: "Instagram", href: "https://instagram.com/cpbyte_kiet",   Icon: FaInstagram   },
  { label: "LinkedIn",  href: "https://linkedin.com/company/cpbyte", Icon: FaLinkedinIn  },
  { label: "Twitter",   href: "https://twitter.com/cpbyte_kiet",     Icon: FaXTwitter    },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

// Section heading fade-up — consistent with the rest of the page system
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 22 },
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

// FAQ answer panel — animates height from 0 to its measured natural height.
// opacity fades in slightly behind the height so text doesn't pop on first frame.
const faqPanelVariant: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.25, ease: "easeOut", delay: 0.08 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.55, 0, 0.45, 1] },
      opacity: { duration: 0.15, ease: "easeIn" },
    },
  },
};

// Plus/X icon swap inside the FAQ trigger
const iconEnterVariant: Variants = {
  hidden: { opacity: 0, rotate: -45, scale: 0.7 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    rotate: 45,
    scale: 0.7,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeading — consistent page-wide pattern
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  subheading?: string;
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

      {subheading && (
        <p className="mt-3 font-sans text-[15px] text-slate-500 leading-relaxed max-w-xl mx-auto">
          {subheading}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SponsorPill — a single sponsor tile inside the marquee track
// ─────────────────────────────────────────────────────────────────────────────

function SponsorPill({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} — sponsor`}
      className={`
        flex-shrink-0
        inline-flex items-center gap-2
        px-5 py-2.5 mx-3
        rounded-full
        border border-slate-200
        bg-white
        font-mono text-sm font-medium tracking-wide
        text-slate-400
        transition-all duration-200
        ${SPONSOR_TIER_COLORS[sponsor.tier]}
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-brand-blue
      `}
    >
      {/* Tier indicator dot — coloured even in grayscale state to hint the tier */}
      <span
        className={`
          w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40
          ${sponsor.tier === "platinum"  ? "bg-brand-blue"   : ""}
          ${sponsor.tier === "gold"      ? "bg-brand-yellow" : ""}
          ${sponsor.tier === "silver"    ? "bg-brand-green"  : ""}
          ${sponsor.tier === "community" ? "bg-brand-red"    : ""}
        `}
        aria-hidden="true"
      />
      {sponsor.name}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SponsorsSection
// Two marquee rows scroll in opposite directions.
// Row 1 scrolls left (standard `animate-marquee`).
// Row 2 scrolls right via animationDirection: "reverse" on the same keyframe.
// Both rows pause on hover via `hover:[animation-play-state:paused]`.
// ─────────────────────────────────────────────────────────────────────────────

function SponsorsSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="sponsors"
      aria-label="Sponsors"
      className="relative bg-white py-20 lg:py-24 overflow-hidden border-b border-slate-200/80"
    >
      {/* Radial glow — mirrors the Hero section's top-left glow for visual bookending */}
      <div
        className="
          pointer-events-none absolute -bottom-24 -right-24
          w-[480px] h-[480px] rounded-full
          bg-brand-yellow/[0.04] blur-3xl
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
          className="text-center mb-12"
        >
          <SectionHeading
            eyebrow="Our Sponsors"
            heading="Backed by the best\nin the industry."
            subheading="CodeRush Season IV is made possible by organisations that believe in building the next generation of competitive programmers."
            centered
          />
        </motion.div>

        {/* Tier legend */}
        <motion.div
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-5 mb-10"
        >
          {(
            [
              { tier: "platinum",  color: "bg-brand-blue",   label: "Platinum" },
              { tier: "gold",      color: "bg-brand-yellow", label: "Gold" },
              { tier: "silver",    color: "bg-brand-green",  label: "Silver" },
              { tier: "community", color: "bg-brand-red",    label: "Community" },
            ] as const
          ).map((item) => (
            <span key={item.tier} className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${item.color} inline-block`}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                {item.label}
              </span>
            </span>
          ))}
        </motion.div>

      </div>

      {/* ── Marquee rows ── outside the max-w container so it bleeds full-width */}

      {/* Edge fade masks — left and right gradients dissolve the track edges */}
      <div
        className="
          pointer-events-none absolute inset-y-0 left-0 w-24 z-10
          bg-gradient-to-r from-white to-transparent
        "
        aria-hidden="true"
      />
      <div
        className="
          pointer-events-none absolute inset-y-0 right-0 w-24 z-10
          bg-gradient-to-l from-white to-transparent
        "
        aria-hidden="true"
      />

      {/* Row 1 — scrolls left */}
      <div
        className={`
          flex overflow-hidden mb-4
          ${reducedMotion ? "" : "hover:[&>div]:[animation-play-state:paused]"}
        `}
        aria-hidden="true"
      >
        <div
          className={`flex flex-nowrap ${reducedMotion ? "" : "animate-marquee"}`}
          style={{ willChange: "transform" }}
        >
          {MARQUEE_TRACK_ROW_1.map((sponsor, idx) => (
            <SponsorPill key={`r1-${sponsor.id}-${idx}`} sponsor={sponsor} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reversed direction via inline style) */}
      <div
        className={`
          flex overflow-hidden
          ${reducedMotion ? "" : "hover:[&>div]:[animation-play-state:paused]"}
        `}
        aria-hidden="true"
      >
        <div
          className={`flex flex-nowrap ${reducedMotion ? "" : "animate-marquee"}`}
          style={{
            willChange: "transform",
            animationDirection: "reverse",
            animationDelay: "-12.5s",
          }}
        >
          {MARQUEE_TRACK_ROW_2.map((sponsor, idx) => (
            <SponsorPill key={`r2-${sponsor.id}-${idx}`} sponsor={sponsor} />
          ))}
        </div>
      </div>

      {/* Become a sponsor CTA */}
      <motion.div
        variants={reducedMotion ? {} : fadeUpVariant}
        custom={0.15}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <a
          href="mailto:cpbyte@kiet.edu?subject=CodeRush%20Sponsorship%20Enquiry"
          className="
            inline-flex items-center gap-2
            font-mono text-xs uppercase tracking-widest
            text-slate-500 hover:text-brand-blue
            border border-slate-200 hover:border-brand-blue/30
            bg-white hover:bg-brand-blue/5
            px-5 py-2.5 rounded-full
            transition-all duration-200
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-brand-blue
            group
          "
        >
          Become a Sponsor
          <ArrowRight
            size={12}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </a>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FaqAccordionItem
// Uses AnimatePresence + motion.div height animation for the answer panel.
// The Plus/X icon swap is also animated via AnimatePresence.
// ─────────────────────────────────────────────────────────────────────────────

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  reducedMotion: boolean;
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
  reducedMotion,
}: FaqAccordionItemProps) {
  return (
    <motion.div
      variants={reducedMotion ? {} : fadeUpVariant}
      custom={index * 0.08}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`
        border rounded-2xl overflow-hidden
        transition-colors duration-200
        ${isOpen
          ? "border-brand-blue/30 bg-brand-blue/[0.02]"
          : "border-slate-200 bg-white hover:border-slate-300"
        }
      `}
    >
      {/* Question trigger button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        className="
          w-full flex items-start justify-between gap-4
          px-6 py-5 text-left
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue
          rounded-2xl
        "
      >
        {/* Question text */}
        <span
          className={`
            font-sans text-sm font-semibold leading-snug
            transition-colors duration-150
            ${isOpen ? "text-brand-dark" : "text-slate-700"}
          `}
        >
          {item.question}
        </span>

        {/* Animated Plus → X icon swap */}
        <span
          className={`
            flex-shrink-0 w-6 h-6 rounded-md
            flex items-center justify-center
            transition-colors duration-150
            ${isOpen
              ? "bg-brand-blue/10 text-brand-blue"
              : "bg-slate-100 text-slate-500"
            }
          `}
          aria-hidden="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                variants={iconEnterVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center justify-center"
              >
                <X size={13} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                variants={iconEnterVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center justify-center"
              >
                <Plus size={13} strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      {/* Answer panel — AnimatePresence handles mount/unmount,
          motion.div handles the height + opacity transition.
          overflow-hidden on the motion.div clips content during height: 0. */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${item.id}`}
            role="region"
            aria-label={item.question}
            variants={reducedMotion ? {} : faqPanelVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            {/* Inner padding wrapper keeps text away from the clipping edge */}
            <div className="px-6 pb-5">
              <div className="h-px bg-slate-100 mb-4" aria-hidden="true" />
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FaqSection
// Manages which accordion item is open (one at a time).
// ─────────────────────────────────────────────────────────────────────────────

function FaqSection({ reducedMotion }: { reducedMotion: boolean }) {
  // null = all closed; string = the id of the currently open item
  const [openId, setOpenId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative bg-slate-50 py-20 lg:py-28 overflow-hidden border-b border-slate-200/80"
    >
      {/* Top gradient wash */}
      <div
        className="
          pointer-events-none absolute top-0 left-0 right-0 h-24
          bg-gradient-to-b from-white/60 to-transparent
        "
        aria-hidden="true"
      />

      {/* Subtle dot-grid texture */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)]
          bg-[size:32px_32px] opacity-30
        "
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <SectionHeading
            eyebrow="FAQ"
            heading="Questions, answered."
            subheading="Everything you need to know before registering. Still stuck? Reach out to the CPBYTE committee on Instagram."
            centered
          />
        </motion.div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, itemIndex) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={itemIndex}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Contact fallback beneath the accordion */}
        <motion.p
          variants={reducedMotion ? {} : fadeUpVariant}
          custom={0.35}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="
            mt-8 text-center
            font-mono text-[10px] uppercase tracking-widest text-slate-400
          "
        >
          More questions?{" "}
          <a
            href="https://instagram.com/cpbyte_kiet"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-brand-blue hover:underline
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-1 focus-visible:outline-brand-blue
              rounded-sm
            "
          >
            DM @cpbyte_kiet on Instagram
          </a>
        </motion.p>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FooterSection
// Four-column layout: Brand + tagline / Navigation / Community / CTA
// Signature element: font-mono compiler-output build info line at the bottom
// ─────────────────────────────────────────────────────────────────────────────

function FooterSection() {
  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="relative bg-white border-t border-slate-200"
    >
      {/* Four-colour accent bar — mirrors SectionDivider, brackets the full page */}
      <div className="flex w-full h-[3px]" aria-hidden="true">
        <div className="flex-1 bg-brand-blue" />
        <div className="flex-1 bg-brand-yellow" />
        <div className="flex-1 bg-brand-green" />
        <div className="flex-1 bg-brand-red" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Main four-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <a
              href="/"
              aria-label="CodeRush home"
              className="
                flex items-center
                opacity-100 hover:opacity-75
                transition-opacity duration-150
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-brand-blue
                rounded-sm w-fit
              "
            >
              <Image
                src="/assets/logo.png"
                alt="CodeRush by CPBYTE KIET"
                width={120}
                height={34}
                className="h-8 w-auto object-contain"
              />
            </a>

            <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-[200px]">
              The flagship competitive programming contest by CPBYTE — KIET Group of Institutions.
            </p>

            <span
              className="
                w-fit font-mono text-[10px] uppercase tracking-widest
                text-brand-blue border border-brand-blue/20 bg-brand-blue/5
                px-2.5 py-1 rounded-full
              "
            >
              {CONTEST_EDITION}
            </span>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Navigate
            </p>
            {FOOTER_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  font-sans text-sm text-slate-500
                  hover:text-brand-dark
                  transition-colors duration-150
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-1 focus-visible:outline-brand-blue
                  rounded-sm w-fit
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 3: Community links */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              CPBYTE Community
            </p>

            {FOOTER_SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`CPBYTE on ${label}`}
                className="
                  inline-flex items-center gap-2
                  font-sans text-sm text-slate-500
                  hover:text-brand-dark
                  transition-colors duration-150
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-1 focus-visible:outline-brand-blue
                  rounded-sm w-fit group
                "
              >
                <Icon
                  size={14}
                  aria-hidden="true"
                  className="text-slate-400 group-hover:text-brand-dark transition-colors duration-150"
                />
                {label}
              </a>
            ))}

            {/* KIET website link */}
            <a
              href="https://www.kiet.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                font-sans text-sm text-slate-500
                hover:text-brand-dark
                transition-colors duration-150
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-1 focus-visible:outline-brand-blue
                rounded-sm w-fit group
              "
            >
              <ExternalLink
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className="text-slate-400 group-hover:text-brand-dark transition-colors duration-150"
              />
              KIET Website
            </a>
          </div>

          {/* Column 4: CTA block */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Register
            </p>

            <p className="font-sans text-xs text-slate-500 leading-relaxed">
              Registrations close on{" "}
              <span className="font-semibold text-slate-700">{REGISTRATION_DEADLINE}</span>.
              Secure your slot on Unstop before the deadline.
            </p>

            <a
              href={UNSTOP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center gap-2
                bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98]
                text-white font-mono text-xs font-medium uppercase tracking-widest
                rounded-md px-5 py-2.5
                shadow-md shadow-brand-blue/20
                transition-all duration-200
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-brand-blue
                w-full sm:w-fit
              "
            >
              Register on Unstop
              <ExternalLink size={11} strokeWidth={2.5} aria-hidden="true" />
            </a>

            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {CONTEST_DATES} · {CONTEST_VENUE}
            </span>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="h-px bg-slate-100 mb-6" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-slate-400 text-center sm:text-left">
            &copy; {CURRENT_YEAR} {ORGANISER_NAME}. All rights reserved.
          </p>

          {/* Compiler-style build info line — signature footer element */}
          <p
            className="
              font-mono text-[10px] text-slate-300 tracking-widest uppercase
              text-center sm:text-right select-none
            "
            aria-hidden="true"
          >
            CPBYTE · KIET · Season IV · CodeRush
          </p>
        </div>

      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — all three sections co-located to share the
// reducedMotion hook without a context provider or prop drilling.
// ─────────────────────────────────────────────────────────────────────────────

export default function EndSectors() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <SponsorsSection reducedMotion={shouldReduceMotion} />
      <FaqSection      reducedMotion={shouldReduceMotion} />
      <FooterSection />
    </>
  );
}