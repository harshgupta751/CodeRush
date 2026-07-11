// src/components/StructuredData.tsx
//
// JSON-LD structured data — the single highest-impact SEO addition for an
// event-based site like CodeRush. This does NOT change anything visible on
// the page; it's a machine-readable script tag that lets Google display
// rich results directly in search: event dates, location, a "Register"
// action link, and expandable FAQ answers right inside the search result.
//
// Three schemas included:
//   1. Event        — powers Google's event rich snippet (dates, venue, CTA)
//   2. Organization — establishes CPBYTE as a known entity (helps brand SERP)
//   3. FAQPage      — turns your FAQ section into expandable Q&A in search
//
// IMPORTANT: The FAQ_SCHEMA_ITEMS array below must be kept in sync with the
// FAQ_ITEMS array in src/components/EndSectors.tsx. If you add/edit/remove
// a question there, mirror the change here. (Recommended long-term fix:
// move FAQ_ITEMS into src/lib/constants.ts as a single shared source, then
// import it in both files instead of duplicating.)
//
// Usage — render once in the root layout:
//   import StructuredData from "@/components/StructuredData";
//   ... inside <body>: <StructuredData />
//
// Validate after deploying with Google's Rich Results Test:
//   https://search.google.com/test/rich-results

import {
  SITE_URL,
  UNSTOP_HREF,
  CONTEST_VENUE,
  ORGANISER_NAME,
} from "@/lib/constants";

// Keep this in sync with EndSectors.tsx → FAQ_ITEMS
const FAQ_SCHEMA_ITEMS = [
  {
    question: "What is the allowed team size for CodeRush?",
    answer:
      "Teams can have between 1 and 4 members. Solo participation is fully supported across all rounds including the finals.",
  },
  {
    question: "Which languages and environments are supported?",
    answer:
      "The online judge supports C (GCC 11), C++ 17, C++ 20, Python 3.11, Java 17, and Kotlin 1.9, evaluated in an isolated sandbox with strict memory and time limits per problem.",
  },
  {
    question: "What are the key rules around the Unstop platform?",
    answer:
      "Registration, qualifier submission, and all communications happen through Unstop. Each participant must register with a verified Unstop account linked to a valid email address.",
  },
  {
    question: "Is there an entry fee to participate in CodeRush?",
    answer:
      "CodeRush Season IV is completely free to enter for all participants across all three eligibility categories — internal KIET students, external university candidates, and global open category entrants.",
  },
] as const;

export default function StructuredData() {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "CodeRush Season IV",
    description:
      "A high-stakes ICPC-style competitive programming contest organised by CPBYTE, KIET Group of Institutions. Live leaderboard, ₹10L+ prize pool, open to students across India.",
    startDate: "2026-08-21T10:00:00+05:30",
    endDate: "2026-08-22T17:00:00+05:30",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: CONTEST_VENUE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ghaziabad",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
    },
    image: [`${SITE_URL}/assets/about-contest.jpg`],
    organizer: {
      "@type": "Organization",
      name: ORGANISER_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: UNSTOP_HREF,
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-07-01T00:00:00+05:30",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CPBYTE — KIET Group of Institutions",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    sameAs: [
      "https://github.com/cpbyte-kiet",
      "https://instagram.com/cpbyte_kiet",
      "https://linkedin.com/company/cpbyte",
      "https://twitter.com/cpbyte_kiet",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SCHEMA_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}