"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView, Variants } from "framer-motion";
import {
  Code2,
  Trophy,
  BarChart2,
  Globe,
  Terminal,
  Flame,
  Users,
  Cpu,
} from "lucide-react";
import { CONTEST_EDITION } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const ABOUT_PARAGRAPHS = [
  "CodeRush is the flagship competitive programming contest organised by CPBYTE — the official coding community of KIET Group of Institutions, Ghaziabad. One of North India's most anticipated annual contests, drawing participants from over 200 colleges.",
  "Every problem set is crafted by a core committee of competitive programmers with national-level credentials — from warm-up implementation tasks to multi-concept hard problems that reward creative thinking under pressure.",
  "A real arena: strict time limits, live rankings, anti-cheat judging, and on-campus finals with ₹10L+ in prizes on the line.",
] as const;

const ABOUT_META = [
  { label: "Organised by", value: "CPBYTE — KIET"             },
  { label: "Edition",       value: CONTEST_EDITION              },
  { label: "Mode",          value: "Online + Offline Finals"   },
  { label: "Eligibility",   value: "UG / PG · All India"       },
] as const;

// Keywords that scroll horizontally across the section — competitive
// programming concepts that establish domain credibility immediately.
const KEYWORDS = [
  "Dynamic Programming", "Graph Theory", "Segment Trees",
  "Binary Search", "Greedy Algorithms", "Combinatorics",
  "ICPC-Style Rules", "Live Leaderboard", "Anti-Cheat Judge",
  "Cash Prizes", "National Ranking", "200+ Colleges",
] as const;

// Simulated code snippet shown in the floating terminal card.
// Deliberately looks like a competitive programming solution stub.
const CODE_LINES = [
  { code: "int main() {",                    color: "#e2e8f0" },
  { code: "  // CodeRush Season IV",         color: "#64748b" },
  { code: "  int n, q;",                     color: "#e2e8f0" },
  { code: "  cin >> n >> q;",                color: "#e2e8f0" },
  { code: "  vector<int> a(n);",             color: "#93c5fd" },
  { code: "  // build segment tree",         color: "#64748b" },
  { code: "  SegTree st(a);",                color: "#86efac" },
  { code: "  while (q--) {",                 color: "#e2e8f0" },
  { code: "    int l, r; cin>>l>>r;",        color: "#e2e8f0" },
  { code: "    cout << st.query(l,r);",      color: "#fde68a" },
  { code: "  }",                             color: "#e2e8f0" },
  { code: "  return 0;",                     color: "#e2e8f0" },
  { code: "}",                               color: "#e2e8f0" },
] as const;

const BENTO_CARDS = [
  {
    id: "leaderboard",
    ghost: "01",
    accentBar: "bg-brand-green",
    accentGlow: "rgba(22,163,74,0.15)",
    accentBorder: "rgba(22,163,74,0.3)",
    accentText: "text-brand-green",
    Icon: BarChart2,
    metric: "<200ms",
    metricLabel: "leaderboard refresh",
    title: "Rankings via Live Leaderboard",
    description:
      "Real-time ranked scoreboard updates continuously. Penalty time, partial scoring, and tiebreakers mirror ICPC-style rules — no ambiguity, no delays.",
    wide: true,
  },
  {
    id: "problems",
    ghost: "02",
    accentBar: "bg-brand-yellow",
    accentGlow: "rgba(245,158,11,0.15)",
    accentBorder: "rgba(245,158,11,0.3)",
    accentText: "text-brand-yellow",
    Icon: Code2,
    metric: "10+",
    metricLabel: "problems per round",
    title: "Complex DSA Problem Sets",
    description:
      "Problems spanning graphs, DP, segment trees, and combinatorics — curated to separate ranks, not pad solve counts.",
    wide: false,
  },
  {
    id: "bracket",
    ghost: "03",
    accentBar: "bg-brand-red",
    accentGlow: "rgba(220,38,38,0.15)",
    accentBorder: "rgba(220,38,38,0.3)",
    accentText: "text-brand-red",
    Icon: Globe,
    metric: "200+",
    metricLabel: "colleges competing",
    title: "Global Bracket Competition",
    description:
      "Open qualifiers, then live on-campus elimination brackets at KIET. Compete, advance, and claim your rank.",
    wide: false,
  },
  {
    id: "prizes",
    ghost: "04",
    accentBar: "bg-brand-blue",
    accentGlow: "rgba(29,78,216,0.15)",
    accentBorder: "rgba(29,78,216,0.3)",
    accentText: "text-brand-blue",
    Icon: Trophy,
    metric: "₹10L+",
    metricLabel: "total prize pool",
    title: "Cash Prizes and Recognition",
    description:
      "Top finishers take home cash, certificates, and sponsor swag. Shortlisted participants get direct referrals to hiring partners.",
    wide: true,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// useCountUp — animates 0 → target when element enters viewport
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target: string, duration = 1400) {
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!started) return;
    const numericStr = target.replace(/[^0-9.]/g, "");
    const num = parseFloat(numericStr);
    if (isNaN(num)) { setDisplay(target); return; }

    const hasComma = target.includes(",");
    const prefix   = target.startsWith("₹") ? "₹" : "";
    const suffix   = target.replace(/[₹0-9,.]/g, "").trim();
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * num);
      let fmt = current.toString();
      if (hasComma && current >= 1000) fmt = current.toLocaleString("en-IN");
      setDisplay(`${prefix}${fmt}${suffix}`);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, target, duration]);

  return { display: started ? display : "0", ref };
}

// ─────────────────────────────────────────────────────────────────────────────
// TypewriterLine — types a single string character by character
// ─────────────────────────────────────────────────────────────────────────────

function TypewriterLine({
  text,
  color,
  delay,
  started,
}: {
  text: string;
  color: string;
  delay: number;
  started: boolean;
}) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setVisible(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 28);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, text, delay]);

  return (
    <div className="font-mono text-[11px] leading-5 whitespace-pre" style={{ color }}>
      {visible}
      {visible.length < text.length && started && (
        <span className="inline-block w-[2px] h-[11px] bg-brand-blue align-middle animate-pulse ml-px" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TerminalCard — floating code window on the right column
// ─────────────────────────────────────────────────────────────────────────────

function TerminalCard({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
      style={{ perspective: "800px" }}
      className="relative"
    >
      {/* Glow behind terminal */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.3) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D1117]">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
          <div className="ml-2 flex items-center gap-1.5">
            <Terminal size={10} className="text-slate-500" aria-hidden="true" />
            <span className="font-mono text-[10px] text-slate-500 tracking-wide">
              solution.cpp — CodeRush IV
            </span>
          </div>
        </div>

        {/* Code body */}
        <div className="p-4 space-y-0.5">
          {CODE_LINES.map((line, i) => (
            <TypewriterLine
              key={i}
              text={line.code}
              color={line.color}
              delay={reducedMotion ? 0 : i * 120}
              started={reducedMotion ? true : inView}
            />
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-brand-blue/80 border-t border-brand-blue/50">
          <span className="font-mono text-[9px] text-white/70 uppercase tracking-widest">
            C++ · UTF-8 · Ln 13
          </span>
          <span className="font-mono text-[9px] text-white/70 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" aria-hidden="true" />
            Judge: Online
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KeywordTape — infinite horizontal scroll of domain keywords
// ─────────────────────────────────────────────────────────────────────────────

function KeywordTape() {
  const doubled = [...KEYWORDS, ...KEYWORDS];
  return (
    <div className="relative overflow-hidden py-4 border-y border-white/5" aria-hidden="true">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0A0F1A] to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0A0F1A] to-transparent pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((keyword, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
              {keyword}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-blue/40 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AboutSection — dark, editorial, premium
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="about"
      aria-label="About CodeRush"
      className="relative overflow-hidden"
      style={{ background: "#0A0F1A" }}
    >
      {/* ── Background texture: subtle noise + grid lines ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px), linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ── Ambient glow — top-right brand-blue ── */}
      <div
        className="pointer-events-none absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Ambient glow — bottom-left brand-red ── */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* ── Keyword tape — top ── */}
      <KeywordTape />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ── Left: editorial copy column ── */}
          <div className="flex flex-col gap-8">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1" aria-hidden="true">
                <span className="w-5 h-[3px] rounded-full bg-brand-blue" />
                <span className="w-5 h-[3px] rounded-full bg-brand-yellow" />
                <span className="w-5 h-[3px] rounded-full bg-brand-green" />
                <span className="w-5 h-[3px] rounded-full bg-brand-red" />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                About CodeRush
              </span>
            </motion.div>

            {/* Large editorial heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight text-white">
                Built by{" "}
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke: "1px rgba(29,78,216,0.6)",
                    color: "transparent",
                    textShadow: "0 0 40px rgba(29,78,216,0.4)",
                  }}
                >
                  engineers,
                </span>
                <br />
                <span className="text-white">for </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #FDBA74 0%, #F97316 40%, #DC2626 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  engineers.
                </span>
              </h2>
            </motion.div>

            {/* Paragraphs */}
            <div className="flex flex-col gap-5">
              {ABOUT_PARAGRAPHS.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                  className="font-sans text-[15px] leading-relaxed text-white/50"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Meta grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <div className="h-px bg-white/5 mb-6" aria-hidden="true" />
              <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
                {ABOUT_META.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                      {item.label}
                    </dt>
                    <dd className="font-sans text-sm font-semibold text-white/80">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Community callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/8 bg-white/[0.03]"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Users size={15} className="text-brand-blue" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand-blue mb-1">
                  Community-Driven
                </p>
                <p className="font-sans text-xs text-white/40 leading-relaxed">
                  CPBYTE runs free weekly practice contests, editorial sessions, and
                  mentorship circles year-round — CodeRush is the culmination of that entire calendar.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: image + terminal card ── */}
          <div className="flex flex-col gap-6">

            {/* Image with angled clip + caption */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative"
            >
              {/* Decorative glow frame */}
              <div
                className="absolute -inset-[1px] rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(29,78,216,0.4) 0%, rgba(220,38,38,0.2) 50%, rgba(245,158,11,0.3) 100%)",
                  padding: "1px",
                }}
                aria-hidden="true"
              >
                <div className="w-full h-full rounded-3xl bg-[#0A0F1A]" />
              </div>

              {/* Image */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10">
                <Image
                  src="/assets/about-contest.jpg"
                  alt="Participants at CodeRush finals at KIET campus"
                  width={720}
                  height={460}
                  quality={90}
                  priority={false}
                  className="w-full object-cover block"
                  style={{ filter: "brightness(0.85) saturate(0.9)" }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Gradient overlay at bottom */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,15,26,0.85) 0%, transparent 55%)" }}
                  aria-hidden="true"
                />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-0.5">
                      CodeRush Finals · KIET Campus
                    </p>
                    <p className="font-sans text-sm font-semibold text-white/90">
                      Season III Highlights
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame size={12} className="text-brand-yellow" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-yellow">
                      {CONTEST_EDITION}
                    </span>
                  </div>
                </div>

                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/70">
                    Season IV Registrations Open
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Terminal code card */}
            <TerminalCard reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>

      {/* ── Keyword tape — bottom ── */}
      <KeywordTape />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BentoCard — dark themed with glowing hover
// ─────────────────────────────────────────────────────────────────────────────

interface BentoCardProps {
  card: (typeof BENTO_CARDS)[number];
  index: number;
  reducedMotion: boolean;
}

function BentoCard({ card, index, reducedMotion }: BentoCardProps) {
  const IconComponent = card.Icon;
  const [hovered, setHovered] = useState(false);
  const { display, ref: countRef } = useCountUp(card.metric, 1400);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.09,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex flex-col justify-between
        rounded-2xl overflow-hidden
        p-6 sm:p-7 cursor-default
        transition-all duration-300
        ${card.wide ? "md:col-span-2" : "md:col-span-1"}
      `}
      style={{
        background: hovered
          ? `linear-gradient(135deg, #111827 0%, ${card.accentGlow.replace("0.15", "0.08")} 100%)`
          : "#0D1424",
        border: `1px solid ${hovered ? card.accentBorder : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered
          ? `0 0 40px ${card.accentGlow}, 0 0 0 1px ${card.accentBorder}`
          : "none",
        transition: "all 0.3s ease",
      }}
      aria-label={card.title}
    >
      {/* Accent top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] ${card.accentBar}`}
        style={{ opacity: hovered ? 1 : 0.6, transition: "opacity 0.3s" }}
        aria-hidden="true"
      />

      {/* Ghost numeral */}
      <span
        className="pointer-events-none select-none absolute bottom-2 right-4 font-mono font-black text-[96px] leading-none"
        style={{ color: "rgba(255,255,255,0.025)", transition: "color 0.3s" }}
        aria-hidden="true"
      >
        {card.ghost}
      </span>

      {/* Card content */}
      <div className="relative z-10 flex flex-col gap-4 h-full">

        {/* Icon + metric */}
        <div className="flex items-start justify-between gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: card.accentGlow,
              border: `1px solid ${card.accentBorder}`,
            }}
            aria-hidden="true"
          >
            <IconComponent size={18} className={card.accentText} strokeWidth={1.75} />
          </div>

          <div className="text-right">
            <span
              ref={countRef}
              className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none block"
            >
              {display}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30 mt-1 block">
              {card.metricLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-sans text-base font-semibold leading-snug transition-colors duration-300 ${hovered ? card.accentText : "text-white/80"}`}>
          {card.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-sm text-white/40 leading-relaxed flex-1">
          {card.description}
        </p>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OverviewSection — dark, matching About
// ─────────────────────────────────────────────────────────────────────────────

function OverviewSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="overview"
      aria-label="Contest Overview"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "#07090F" }}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Top gradient blend from About's dark bg */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-32 z-0"
        style={{ background: "linear-gradient(to bottom, #0A0F1A, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Eyebrow */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/30 border border-white/10 bg-white/[0.03] px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" aria-hidden="true" />
              What to Expect
            </span>
          </div>

          <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-4">
            Everything a competitive<br />
            <span
              style={{
                background: "linear-gradient(135deg, #93c5fd 0%, #1D4ED8 50%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              programmer needs.
            </span>
          </h2>

          <p className="font-sans text-[15px] text-white/35 leading-relaxed max-w-lg mx-auto">
            Four pillars that make CodeRush a complete contest experience — not just another online round.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {BENTO_CARDS.map((card, i) => (
            <BentoCard key={card.id} card={card} index={i} reducedMotion={reducedMotion} />
          ))}
        </div>

        {/* Bottom attestation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex justify-center items-center gap-3"
        >
          <span className="h-px w-12 bg-white/10" aria-hidden="true" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/20">
            All rounds judged on a custom online judge · Plagiarism detection enabled
          </p>
          <span className="h-px w-12 bg-white/10" aria-hidden="true" />
        </motion.div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionDivider — four-colour brand strip between the two sections
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="flex w-full h-[2px]" aria-hidden="true">
      <div className="flex-1 bg-brand-blue" />
      <div className="flex-1 bg-brand-yellow" />
      <div className="flex-1 bg-brand-green" />
      <div className="flex-1 bg-brand-red" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutOverview() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <>
      <AboutSection reducedMotion={shouldReduceMotion} />
      <SectionDivider />
      <OverviewSection reducedMotion={shouldReduceMotion} />
    </>
  );
}