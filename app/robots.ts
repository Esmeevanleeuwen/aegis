import type { MetadataRoute } from "next";
import { absoluteUrl, isPreview } from "@/lib/dossier-platforms";

export default function robots(): MetadataRoute.Robots {
  return isPreview
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: absoluteUrl("/sitemap.xml") };
}
