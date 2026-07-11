// src/app/robots.ts
//
// Next.js App Router metadata file convention — automatically generates
// /robots.txt at build time. No manual robots.txt file needed in /public.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No routes to disallow — this is a single-page marketing site with
        // no admin panel, no user-generated content, no duplicate params.
        disallow: [],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}