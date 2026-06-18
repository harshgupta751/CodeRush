"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

import Image from "next/image";
import { UNSTOP_HREF } from "@/lib/constants";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Overview", href: "#overview" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
] as const;

// UNSTOP_HREF is imported from @/lib/constants — edit it there to update
// the registration link everywhere at once.
const REGISTER_HREF = UNSTOP_HREF;

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, label, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="
        relative text-sm font-medium text-slate-600
        hover:text-slate-900 transition-colors duration-150
        after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
        after:bg-brand-blue after:transition-all after:duration-200
        hover:after:w-full focus-visible:outline-none focus-visible:text-slate-900
      "
    >
      {label}
    </a>
  );
}

function RegisterButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={REGISTER_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        bg-brand-blue hover:bg-brand-blue/90 text-white font-mono
        rounded-md px-5 py-2 text-sm font-medium transition-all duration-200
        shadow-md shadow-brand-blue/10 inline-flex items-center gap-1.5
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-brand-blue active:scale-95
        ${className}
      `}
    >
      Register Now
      <ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  // Shadow elevation on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
      suppressHydrationWarning
        className={`
          fixed top-9 left-0 right-0 z-50
          bg-white/80 backdrop-blur-md border-b border-slate-200/80
          transition-shadow duration-300
          ${scrolled ? "shadow-sm shadow-slate-900/5" : "shadow-none"}
        `}
        role="banner"
      >
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Primary navigation"
        >
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <a
              href="/"
              aria-label="CodeRush home"
              className="
                flex-shrink-0 flex items-center
                rounded-sm opacity-100 hover:opacity-80
                transition-opacity duration-150
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-brand-blue
              "
            >
              <Image
                src="/assets/logo.png"
                alt="CodeRush by CPBYTE KIET"
                width={140}
                height={40}
                priority
                className="h-10 w-auto object-contain"
              />
            </a>

            {/* ── Desktop links ── */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden lg:block flex-shrink-0">
              <RegisterButton />
            </div>

            {/* ── Mobile toggle ── */}
            <button
              ref={toggleRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="
                lg:hidden flex items-center justify-center
                w-9 h-9 rounded-md text-slate-600 hover:text-slate-900
                hover:bg-slate-100 transition-colors duration-150
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-brand-blue
              "
            >
              {menuOpen
                ? <X size={20} strokeWidth={2} aria-hidden="true" />
                : <Menu size={20} strokeWidth={2} aria-hidden="true" />
              }
            </button>
          </div>
        </nav>

        {/* ── Mobile slide-down menu ── */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="region"
          aria-label="Mobile navigation"
          className={`
 lg:hidden overflow-hidden
  ${mounted ? "transition-all duration-300 ease-in-out" : ""}
  ${menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"}
            border-t border-slate-200/80 bg-white/95 backdrop-blur-md
          `}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="
                  flex items-center justify-between
                  px-3 py-3 rounded-md text-sm font-medium text-slate-700
                  hover:text-slate-900 hover:bg-slate-50
                  transition-colors duration-150
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-brand-blue
                "
              >
                {link.label}
                <ChevronRight
                  size={14}
                  strokeWidth={2}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              </a>
            ))}

            {/* Divider */}
            <div className="my-2 h-px bg-slate-100" role="separator" />

            <RegisterButton className="w-full justify-center" />
          </div>
        </div>
      </header>

      {/* ── Spacer — AnnouncementBar (36px) + Navbar (64px) = 100px ── */}
      <div className="h-[100px]" aria-hidden="true" />
    </>
  );
}