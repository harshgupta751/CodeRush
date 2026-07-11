// src/app/manifest.ts
//
// Next.js App Router metadata file convention — automatically generates
// /manifest.webmanifest. Enables "Add to Home Screen" on mobile browsers
// and sets the browser UI theme colour to match the CodeRush brand.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeRush — CPBYTE KIET",
    short_name: "CodeRush",
    description:
      "ICPC-style competitive programming contest by CPBYTE, KIET Group of Institutions. Season IV — 21-22 August 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1D4ED8",
    icons: [
      { src: "/favicon.ico",   sizes: "any",     type: "image/x-icon" },
      { src: "/icon-192.png",  sizes: "192x192", type: "image/png"    },
      { src: "/icon-512.png",  sizes: "512x512", type: "image/png"    },
    ],
  };
}