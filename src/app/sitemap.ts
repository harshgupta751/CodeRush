// src/app/sitemap.ts
//
// Next.js App Router metadata file convention — automatically generates
// /sitemap.xml at build time.
//
// This is a single-page site (all sections are #anchors on one URL), so
// the sitemap has exactly one entry. If you ever add separate routes
// (e.g. /past-winners, /blog/[slug]), add additional entries to this array.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}