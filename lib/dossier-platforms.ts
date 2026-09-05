export const platformName: string = "Ampara";

function origin(value: string | undefined, fallback: string): string {
  try {
    const url = new URL(value || fallback);
    return url.protocol === "https:" && !url.username && !url.password ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

export const MERIDIAN_URL = origin(process.env.NEXT_PUBLIC_MERIDIAN_URL, "https://meridiancollective.nl");
export const AMPARA_URL = origin(process.env.NEXT_PUBLIC_AMPARA_URL, "https://aegis-six-navy.vercel.app");
export const siteUrl = origin(process.env.NEXT_PUBLIC_SITE_URL, AMPARA_URL);
export const partnerUrl = MERIDIAN_URL;
export const partnerName = "Meridian";
export const isPreview = process.env.VERCEL_ENV === "preview";
export const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
