"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView, Variants } from "framer-motion";
import {
  Code2, Trophy, BarChart2, Globe,
  Terminal, Flame, Users, Cpu,
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
  { label: "Organised by", value: "CPBYTE — KIET"           },
  { label: "Edition",       value: CONTEST_EDITION            },
  { label: "Mode",          value: "Online + Offline Finals" },
  { label: "Eligibility",   value: "UG / PG · All India"     },
] as const;

const KEYWORDS = [
  "Dynamic Programming", "Graph Theory", "Segment Trees",
  "Binary Search", "Greedy Algorithms", "Combinatorics",
  "ICPC-Style Rules", "Live Leaderboard", "Anti-Cheat Judge",
  "Cash Prizes", "National Ranking", "200+ Colleges",
] as const;

const CODE_LINES = [
  { code: "int main() {",              color: "#1e293b" },
  { code: "  // CodeRush Season IV",   color: "#94a3b8" },
  { code: "  int n, q;",               color: "#1e293b" },
  { code: "  cin >> n >> q;",          color: "#1e293b" },
  { code: "  vector<int> a(n);",       color: "#1d4ed8" },
  { code: "  // build segment tree",   color: "#94a3b8" },
  { code: "  SegTree st(a);",          color: "#16a34a" },
  { code: "  while (q--) {",           color: "#1e293b" },
  { code: "    int l,r; cin>>l>>r;",   color: "#1e293b" },
  { code: "    cout<<st.query(l,r);",  color: "#b45309" },
  { code: "  }",                       color: "#1e293b" },
  { code: "  return 0;",               color: "#1e293b" },
  { code: "}",                         color: "#1e293b" },
] as const;

const BENTO_CARDS = [
  {
    id: "leaderboard",
    ghost: "01",
    accentBar:    "bg-brand-green",
    accentGlow:   "rgba(22,163,74,0.08)",
    accentBorder: "rgba(22,163,74,0.25)",
    accentShadow: "rgba(22,163,74,0.12)",
    accentText:   "text-brand-green",
    accentRaw:    "#16A34A",
    Icon: BarChart2,
    metric: "<200ms",
    metricLabel: "leaderboard refresh",
    title: "Rankings via Live Leaderboard",
    description: "Real-time ranked scoreboard updates continuously. Penalty time, partial scoring, and tiebreakers mirror ICPC-style rules.",
    wide: true,
  },
  {
    id: "problems",
    ghost: "02",
    accentBar:    "bg-brand-yellow",
    accentGlow:   "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.25)",
    accentShadow: "rgba(245,158,11,0.12)",
    accentText:   "text-brand-yellow",
    accentRaw:    "#F59E0B",
    Icon: Code2,
    metric: "10+",
    metricLabel: "problems per round",
    title: "Complex DSA Problem Sets",
    description: "Problems spanning graphs, DP, segment trees, and combinatorics — curated to separate ranks, not pad solve counts.",
    wide: false,
  },
  {
    id: "bracket",
    ghost: "03",
    accentBar:    "bg-brand-red",
    accentGlow:   "rgba(220,38,38,0.08)",
    accentBorder: "rgba(220,38,38,0.25)",
    accentShadow: "rgba(220,38,38,0.12)",
    accentText:   "text-brand-red",
    accentRaw:    "#DC2626",
    Icon: Globe,
    metric: "200+",
    metricLabel: "colleges competing",
    title: "Global Bracket Competition",
    description: "Open qualifiers, then live on-campus elimination brackets at KIET. Compete, advance, and claim your rank.",
    wide: false,
  },
  {
    id: "prizes",
    ghost: "04",
    accentBar:    "bg-brand-blue",
    accentGlow:   "rgba(29,78,216,0.08)",
    accentBorder: "rgba(29,78,216,0.25)",
    accentShadow: "rgba(29,78,216,0.12)",
    accentText:   "text-brand-blue",
    accentRaw:    "#1D4ED8",
    Icon: Trophy,
    metric: "₹10L+",
    metricLabel: "total prize pool",
    title: "Cash Prizes and Recognition",
    description: "Top finishers take home cash, certificates, and sponsor swag. Shortlisted participants get direct referrals to hiring partners.",
    wide: true,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// useCountUp
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target: string, duration = 1400) {
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);
  const ref    = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

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
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) { setDisplay(target); return; }
    const prefix   = target.startsWith("₹") ? "₹" : "";
    const suffix   = target.replace(/[₹0-9,.]/g, "").trim();
    const hasComma = target.includes(",");
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const c = Math.floor(e * num);
      setDisplay(`${prefix}${hasComma && c >= 1000 ? c.toLocaleString("en-IN") : c}${suffix}`);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, target, duration]);

  return { display: started ? display : "0", ref };
}

// ─────────────────────────────────────────────────────────────────────────────
// TypewriterLine
// ─────────────────────────────────────────────────────────────────────────────

function TypewriterLine({
  text, color, delay, started,
}: { text: string; color: string; delay: number; started: boolean }) {
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
// TerminalCard — light themed code window
// ─────────────────────────────────────────────────────────────────────────────

function TerminalCard({ reducedMotion }: { reducedMotion: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      style={{ perspective: "800px" }}
      className="relative"
    >
      {/* Soft blue shadow behind the terminal */}
      <div
        className="absolute -inset-3 rounded-3xl blur-2xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.25) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <span className="w-3 h-3 rounded-full bg-red-400"   aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-400"  aria-hidden="true" />
          <div className="ml-2 flex items-center gap-1.5">
            <Terminal size={10} className="text-slate-400" aria-hidden="true" />
            <span className="font-mono text-[10px] text-slate-400 tracking-wide">
              solution.cpp — CodeRush IV
            </span>
          </div>
        </div>

        {/* Code body */}
        <div className="p-4 space-y-0.5 bg-slate-50/50">
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

        {/* Status bar — brand-blue */}
        <div className="flex items-center justify-between px-4 py-2 bg-brand-blue border-t border-brand-blue/50">
          <span className="font-mono text-[9px] text-white/80 uppercase tracking-widest">
            C++ · UTF-8 · Ln 13
          </span>
          <span className="font-mono text-[9px] text-white/80 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" aria-hidden="true" />
            Judge: Online
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KeywordTape
// ─────────────────────────────────────────────────────────────────────────────

function KeywordTape() {
  const doubled = [...KEYWORDS, ...KEYWORDS];
  return (
    <div className="relative overflow-hidden py-3 border-y border-slate-100" aria-hidden="true">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((keyword, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {keyword}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-blue/30 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AboutSection — light, editorial, Olympic
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="about"
      aria-label="About CodeRush"
      className="relative overflow-hidden bg-white"
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize:  "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Blue glow — top-right */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.06) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Orange warmth — bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Keyword tape — top */}
      <KeywordTape />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* ── Left: copy ── */}
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
                <span className="w-5 h-[3px] rounded-full bg-brand-blue"   />
                <span className="w-5 h-[3px] rounded-full bg-brand-yellow" />
                <span className="w-5 h-[3px] rounded-full bg-brand-green"  />
                <span className="w-5 h-[3px] rounded-full bg-brand-red"    />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                About CodeRush
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              <h2 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                <span className="text-brand-dark">Built by </span>
                <span
                  className="relative inline-block"
                  style={{
                    WebkitTextStroke:  "2px #1D4ED8",
                    color:             "transparent",
                  }}
                >
                  engineers,
                </span>
                <br />
                <span className="text-brand-dark">for </span>
                <span
                  style={{
                    background:              "linear-gradient(135deg,#FDBA74 0%,#F97316 40%,#DC2626 100%)",
                    WebkitBackgroundClip:    "text",
                    WebkitTextFillColor:     "transparent",
                    backgroundClip:          "text",
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
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}
                  className="font-sans text-[15px] leading-relaxed text-slate-500"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
            >
              <div className="h-px bg-slate-100 mb-6" aria-hidden="true" />
              <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
                {ABOUT_META.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-brand-blue">
                      {item.label}
                    </dt>
                    <dd className="font-sans text-sm font-semibold text-slate-700">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Community callout */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50"
            >
              <div
                className="w-9 h-9 rounded-lg bg-brand-blue/10 border border-brand-blue/20
                           flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <Users size={15} className="text-brand-blue" />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand-blue mb-1">
                  Community-Driven
                </p>
                <p className="font-sans text-xs text-slate-500 leading-relaxed">
                  CPBYTE runs free weekly practice contests, editorial sessions, and
                  mentorship circles year-round — CodeRush is the culmination of that entire calendar.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: image + terminal ── */}
          <div className="flex flex-col gap-6">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative"
            >
              {/* Coloured offset frame */}
              <div
                className="absolute top-3 left-3 w-full h-full rounded-3xl"
                style={{
                  background: "linear-gradient(135deg,#1D4ED8,#DC2626,#F59E0B)",
                  padding: "1.5px",
                  borderRadius: "24px",
                }}
                aria-hidden="true"
              >
                <div className="w-full h-full rounded-3xl bg-white" />
              </div>

              <div className="relative z-10 rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
                <Image
                  src="/assets/about-contest.jpg"
                  alt="Participants at CodeRush finals at KIET campus"
                  width={720} height={460} quality={90} priority={false}
                  className="w-full object-cover block"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Gradient caption overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 50%)" }}
                  aria-hidden="true"
                />

                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/60 mb-0.5">
                      CodeRush Finals · KIET Campus
                    </p>
                    <p className="font-sans text-sm font-semibold text-white">
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
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" aria-hidden="true" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">
                    Season IV Registrations Open
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Terminal */}
            <TerminalCard reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>

      {/* Keyword tape — bottom */}
      <KeywordTape />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview card inner content — real contest information, no fake live data
// Each card has a unique visual treatment that communicates real facts about
// CodeRush through premium design rather than placeholder numbers.
// ─────────────────────────────────────────────────────────────────────────────

// Card A — Contest Format: animated round badges showing the actual structure
const ROUND_BADGES = [
  { label: "Qualifier",     sub: "Online · All India",    color: "#1D4ED8", bg: "rgba(29,78,216,0.07)",  border: "rgba(29,78,216,0.20)" },
  { label: "Semi-Final",    sub: "Online · Top Teams",    color: "#F59E0B", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.22)" },
  { label: "Grand Final",   sub: "On-Campus · KIET",      color: "#DC2626", bg: "rgba(220,38,38,0.07)",  border: "rgba(220,38,38,0.22)" },
] as const;

function FormatWidget({ inView }: { inView: boolean }) {
  return (
    <div className="mt-5 flex flex-col gap-2" aria-label="Contest round structure">
      {ROUND_BADGES.map((round, i) => (
        <motion.div
          key={round.label}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: round.bg, border: `1px solid ${round.border}` }}
        >
          {/* Step number */}
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
            style={{ background: round.color, color: "#fff" }}
          >
            {i + 1}
          </span>
          <div className="flex flex-col gap-0">
            <span className="font-sans text-xs font-semibold" style={{ color: round.color }}>
              {round.label}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              {round.sub}
            </span>
          </div>
          {/* Connector arrow — not on last item */}
          {i < ROUND_BADGES.length - 1 && (
            <svg className="ml-auto flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2L12 7L7 12M2 7H12" stroke={round.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          )}
          {i === ROUND_BADGES.length - 1 && (
            <span className="ml-auto font-mono text-[9px] text-brand-yellow font-semibold flex-shrink-0">
              ₹10L+ Prizes
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Card B — Problem Craft: visual spectrum showing difficulty range with real labels
const DIFFICULTY_SPECTRUM = [
  { label: "Warm-Up",    desc: "Implementation · Greedy",          pct: 100, color: "#16a34a" },
  { label: "Mid",        desc: "Graphs · Binary Search · DP",      pct: 75,  color: "#f59e0b" },
  { label: "Advanced",   desc: "Segment Trees · Combinatorics",    pct: 50,  color: "#f97316" },
  { label: "Expert",     desc: "Multi-concept · Creative",         pct: 25,  color: "#dc2626" },
] as const;

function DifficultyWidget({ inView }: { inView: boolean }) {
  return (
    <div className="mt-5 flex flex-col gap-3" aria-label="Problem difficulty breakdown">
      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
        Problem spectrum per round
      </span>
      {DIFFICULTY_SPECTRUM.map((tier, i) => (
        <div key={tier.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-semibold text-slate-600">{tier.label}</span>
            <span className="font-mono text-[9px] text-slate-400 truncate max-w-[140px] text-right">{tier.desc}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(226,232,240,0.80)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: tier.color }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${tier.pct}%` } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Easy</span>
        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">Hard</span>
      </div>
    </div>
  );
}

// Card C — Prize & Recognition: what winners actually receive
const PRIZE_HIGHLIGHTS = [
  { icon: "🏆", label: "Cash Prizes",       desc: "Top 3 teams + individual awards" },
  { icon: "📜", label: "Certificates",      desc: "For all finalists & ranked participants" },
  { icon: "🎁", label: "Sponsor Swag",      desc: "Kits from industry sponsors"       },
  { icon: "🔗", label: "Hiring Referrals",  desc: "Direct to partner companies"       },
] as const;

function PrizeWidget({ inView }: { inView: boolean }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Prize and recognition details">
      {PRIZE_HIGHLIGHTS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.38, delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-1.5 p-3 rounded-xl border border-white/60"
          style={{ background: "rgba(248,250,252,0.80)" }}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="font-sans text-[11px] font-semibold text-slate-700 leading-tight">{item.label}</span>
          <span className="font-mono text-[9px] text-slate-400 leading-relaxed">{item.desc}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Card D — Reach & Scale: animated stat pills showing real contest scale
const SCALE_STATS = [
  { value: "200+",  label: "Colleges",      color: "#1D4ED8", bg: "rgba(29,78,216,0.07)",  border: "rgba(29,78,216,0.18)" },
  { value: "Pan-India", label: "Reach",     color: "#16A34A", bg: "rgba(22,163,74,0.07)",  border: "rgba(22,163,74,0.18)" },
  { value: "3",     label: "Rounds",        color: "#F59E0B", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.22)" },
  { value: "48hrs", label: "Final Sprint",  color: "#DC2626", bg: "rgba(220,38,38,0.07)",  border: "rgba(220,38,38,0.20)" },
  { value: "₹10L+", label: "Prize Pool",   color: "#7c3aed", bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.20)" },
  { value: "ICPC",  label: "Style Rules",  color: "#0891b2", bg: "rgba(8,145,178,0.07)",  border: "rgba(8,145,178,0.18)" },
] as const;

function ScaleWidget({ inView }: { inView: boolean }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2" aria-label="Contest scale and reach">
      {SCALE_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12, scale: 0.88 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center px-3 py-2 rounded-xl"
          style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
        >
          <span className="font-mono text-sm font-bold" style={{ color: stat.color }}>
            {stat.value}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Updated BENTO_CARDS — real contest information, no fake metrics
// ─────────────────────────────────────────────────────────────────────────────

const OVERVIEW_CARDS = [
  {
    id: "format",
    ghost: "01",
    accentBar:    "bg-brand-blue",
    accentGlow:   "rgba(29,78,216,0.07)",
    accentBorder: "rgba(29,78,216,0.22)",
    accentShadow: "rgba(29,78,216,0.10)",
    accentText:   "text-brand-blue",
    accentRaw:    "#1D4ED8",
    Icon: BarChart2,
    badge: "3 Rounds",
    badgeSub: "qualifier → semi → final",
    title: "ICPC-Style Contest Format",
    description:
      "Three progressive rounds — online qualifier, online semi-final, and a live on-campus grand final at KIET. Each stage raises the bar.",
    wide: true,
    widget: "format",
  },
  {
    id: "problems",
    ghost: "02",
    accentBar:    "bg-brand-yellow",
    accentGlow:   "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.22)",
    accentShadow: "rgba(245,158,11,0.10)",
    accentText:   "text-brand-yellow",
    accentRaw:    "#F59E0B",
    Icon: Code2,
    badge: "10+ Problems",
    badgeSub: "per round",
    title: "Complex DSA Problem Sets",
    description:
      "Curated by national-level competitive programmers. Problems span implementation, graphs, DP, and multi-concept hard problems.",
    wide: false,
    widget: "problems",
  },
  {
    id: "prizes",
    ghost: "03",
    accentBar:    "bg-brand-green",
    accentGlow:   "rgba(22,163,74,0.07)",
    accentBorder: "rgba(22,163,74,0.22)",
    accentShadow: "rgba(22,163,74,0.10)",
    accentText:   "text-brand-green",
    accentRaw:    "#16A34A",
    Icon: Trophy,
    badge: "₹10L+ Pool",
    badgeSub: "cash · swag · referrals",
    title: "Prizes and Recognition",
    description:
      "Cash awards for top finishers, certificates for all ranked participants, sponsor swag kits, and direct hiring referrals to partner companies.",
    wide: false,
    widget: "prizes",
  },
  {
    id: "scale",
    ghost: "04",
    accentBar:    "bg-brand-red",
    accentGlow:   "rgba(220,38,38,0.07)",
    accentBorder: "rgba(220,38,38,0.22)",
    accentShadow: "rgba(220,38,38,0.10)",
    accentText:   "text-brand-red",
    accentRaw:    "#DC2626",
    Icon: Globe,
    badge: "200+ Colleges",
    badgeSub: "pan-india reach",
    title: "National Scale Competition",
    description:
      "Open to students from any college across India — KIET, NITs, IITs, state universities, and autonomous institutions all on the same leaderboard.",
    wide: true,
    widget: "scale",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// OverviewCard — premium light card with unique per-card widget
// ─────────────────────────────────────────────────────────────────────────────

function OverviewCard({
  card, index, reducedMotion,
}: {
  card: (typeof OVERVIEW_CARDS)[number];
  index: number;
  reducedMotion: boolean;
}) {
  const IconComponent = card.Icon;
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse]     = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLElement>(null);
  const inView  = useInView(cardRef, { once: true, margin: "-60px" });

  const entryDirs = [
    { y: 36, x: 0   },
    { y: 0,  x: -32 },
    { y: 0,  x: 32  },
    { y: 36, x: 0   },
  ];
  const dir = entryDirs[index] ?? { y: 36, x: 0 };

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: dir.y, x: dir.x, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.09 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative flex flex-col overflow-hidden rounded-2xl cursor-default
        ${card.wide ? "md:col-span-2" : "md:col-span-1"}`}
      style={{
        // Solid white bg — no backdrop-blur so the image behind is NOT blurred
        // Cards pop as crisp white panels floating over the visible bg image
        background:  hovered ? "#ffffff" : "rgba(255,255,255,0.96)",
        border:      `1px solid ${hovered ? card.accentBorder : "rgba(30,41,59,0.10)"}`,
        boxShadow:   hovered
          ? `0 12px 48px ${card.accentShadow}, 0 4px 16px rgba(0,0,0,0.10)`
          : "0 6px 28px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
        transition:  "background 0.25s, border-color 0.25s, box-shadow 0.25s",
      }}
      aria-label={card.title}
    >
      {/* Mouse-tracking spotlight */}
      {hovered && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, ${card.accentGlow} 0%, transparent 65%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Accent top bar */}
      <motion.div
        className={`absolute top-0 left-0 right-0 h-[3px] ${card.accentBar} z-10`}
        animate={{ opacity: hovered ? 1 : 0.65 }}
        transition={{ duration: 0.25 }}
        aria-hidden="true"
      />

      {/* Halo that bleeds above card on hover */}
      {hovered && !reducedMotion && (
        <div
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-2xl z-0"
          style={{ background: card.accentGlow }}
          aria-hidden="true"
        />
      )}

      {/* Card body */}
      <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-7 h-full">

        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: hovered ? card.accentGlow : "#f8fafc",
              border:     `1px solid ${hovered ? card.accentBorder : "rgba(30,41,59,0.08)"}`,
              transition: "all 0.3s",
            }}
            aria-hidden="true"
          >
            <IconComponent size={19} className={card.accentText} strokeWidth={1.75} />
          </div>

          {/* Badge pill — real label, not a fake counter */}
          <div className="text-right flex-shrink-0">
            <span
              className="font-mono font-bold tracking-tight leading-none block"
              style={{ fontSize: "clamp(16px, 2.2vw, 22px)", color: card.accentRaw }}
            >
              {card.badge}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-1 block">
              {card.badgeSub}
            </span>
          </div>
        </div>

        {/* Title */}
        <motion.h3
          className="font-sans text-base font-semibold leading-snug"
          animate={{ color: hovered ? card.accentRaw : "#1E293B" }}
          transition={{ duration: 0.25 }}
        >
          {card.title}
        </motion.h3>

        {/* Description */}
        <p className="font-sans text-sm text-slate-500 leading-relaxed">
          {card.description}
        </p>

        {/* Unique inner widget — real information, premium design */}
        {card.widget === "format"   && <FormatWidget     inView={inView} />}
        {card.widget === "problems" && <DifficultyWidget inView={inView} />}
        {card.widget === "prizes"   && <PrizeWidget      inView={inView} />}
        {card.widget === "scale"    && <ScaleWidget      inView={inView} />}
      </div>

      {/* Ghost numeral watermark */}
      <span
        className="pointer-events-none select-none absolute bottom-3 right-5 font-mono font-black leading-none z-0"
        style={{
          fontSize:   "80px",
          color:      hovered ? `${card.accentRaw}08` : "rgba(30,41,59,0.022)",
          transition: "color 0.3s",
        }}
        aria-hidden="true"
      >
        {card.ghost}
      </span>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OverviewSection — cinematic overview-bg.jpg with frosted glass cards
//
// Layering system (bottom → top):
//   1. overview-bg.jpg  — full-bleed, object-cover, fixed parallax feel
//   2. White gradient overlay — heavy at top/bottom, near-transparent centre
//      so the coding screenshot bleeds through behind the cards without
//      ever competing with the text
//   3. Fine dot-grid at very low opacity — adds micro-texture over the image
//   4. Content: heading (white text on the image area) + frosted glass cards
//
// Cards use bg-white/88 + backdrop-blur-md so the image peeks through
// each card at ~12% opacity — enough depth to feel premium, not distracting.
// ─────────────────────────────────────────────────────────────────────────────

function OverviewSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="overview"
      aria-label="Contest Overview"
      className="relative overflow-hidden pt-16 pb-12 lg:pt-20 lg:pb-16"
    >

      {/* ── LAYER 1: Background image — full-bleed, clearly visible ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/overview-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          aria-hidden="true"
        />
      </div>

      {/* ── LAYER 2: Minimal scrim — only enough for text readability ──
          No heavy white at top/bottom — image must be visible everywhere.
          Only the absolute centre of the heading gets a mild white haze.
          Cards float as solid white panels — they don't need an overlay.  */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom," +
            "rgba(255,255,255,0.60) 0%," +
            "rgba(255,255,255,0.15) 8%," +
            "rgba(255,255,255,0.06) 20%," +
            "rgba(255,255,255,0.04) 50%," +
            "rgba(255,255,255,0.06) 80%," +
            "rgba(255,255,255,0.15) 92%," +
            "rgba(255,255,255,0.60) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── LAYER 3: Tiny brand-blue tint — ties image to CodeRush identity ── */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "rgba(29,78,216,0.03)" }}
        aria-hidden="true"
      />

      {/* ── LAYER 5: Content ── */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading — sits directly on the image zone, uses dark text
            because the image is bright (Mac + code + daylit room)          */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 lg:mb-12"
        >
          {/* Eyebrow pill — frosted so image shows through */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest
                         text-brand-blue px-4 py-2 rounded-full"
              style={{
                border:     "1px solid rgba(29,78,216,0.30)",
                background: "rgba(255,255,255,0.92)",
                boxShadow:  "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-60" aria-hidden="true" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-blue" aria-hidden="true" />
              </span>
              What to Expect
            </span>
          </div>

          {/* Main heading — strong white halo for readability over visible image */}
          <h2
            className="font-sans font-black text-brand-dark tracking-tight mb-4"
            style={{
              fontSize:   "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              textShadow:
                "0 0 20px rgba(255,255,255,1), " +
                "0 0 40px rgba(255,255,255,0.95), " +
                "0 2px 8px rgba(255,255,255,0.9)",
            }}
          >
            Everything a competitive{" "}
            <br className="hidden sm:block" />
            {/* Solid colour — no webkit gradient which blurs on dark image backgrounds */}
            <span style={{ color: "#1D4ED8" }}>
              programmer needs.
            </span>
          </h2>

          {/* Subheading — strong white pill so it reads over dark parts of image */}
          <p
            className="font-sans text-[15px] leading-relaxed max-w-xl mx-auto px-5 py-2.5 rounded-xl"
            style={{
              color:      "#334155",
              background: "rgba(255,255,255,0.92)",
              border:     "1px solid rgba(30,41,59,0.08)",
              boxShadow:  "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            Four pillars that define the CodeRush experience — hover each card to explore.
          </p>

          {/* Animated underline bars */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { color: "bg-brand-green",  w: 48 },
              { color: "bg-brand-yellow", w: 32 },
              { color: "bg-brand-red",    w: 20 },
              { color: "bg-brand-blue",   w: 12 },
            ].map(({ color, w }, i) => (
              <motion.div
                key={color}
                className={`h-[2px] rounded-full ${color}`}
                initial={{ width: 0 }}
                whileInView={{ width: w }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Card grid — cards use frosted glass so image bleeds through */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {OVERVIEW_CARDS.map((card, i) => (
            <OverviewCard key={card.id} card={card} index={i} reducedMotion={reducedMotion} />
          ))}
        </div>

        {/* Bottom attestation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex justify-center items-center gap-4"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-slate-300/50" aria-hidden="true" />
          <p
            className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{
              color:      "#64748b",
              background: "rgba(255,255,255,0.92)",
              border:     "1px solid rgba(30,41,59,0.08)",
            }}
          >
            Custom online judge · Plagiarism detection · Real-time scoring
          </p>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-slate-300/50" aria-hidden="true" />
        </motion.div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionDivider
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="flex w-full h-[3px]" aria-hidden="true">
      <div className="flex-1 bg-brand-blue"   />
      <div className="flex-1 bg-brand-yellow" />
      <div className="flex-1 bg-brand-green"  />
      <div className="flex-1 bg-brand-red"    />
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
      <AboutSection   reducedMotion={shouldReduceMotion} />
      <SectionDivider />
      <OverviewSection reducedMotion={shouldReduceMotion} />
    </>
  );
}