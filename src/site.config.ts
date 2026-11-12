/**
 * Site-wide configuration. Download targets live here only:
 * set `href` to a URL when a platform has a real download channel;
 * `null` renders the non-clickable "In arrivo" state.
 */
export type Platform = "macos" | "windows" | "ios";

export interface PlatformCta {
  platform: Platform;
  name: string;
  /** Label shown when a link exists. */
  label: string;
  href: string | null;
}

export const site = {
  name: "Danamus",
  title: "Danamus — Taglia i tempi morti delle tue partite",
  description:
    "Danamus trova da solo gli scambi nei video di ping pong e taglia i tempi morti. L'AI gira sul tuo dispositivo, senza abbonamenti. Per Windows, macOS e iOS.",
  locale: "it_IT",
  comingSoonLabel: "In arrivo",
  platforms: [
    { platform: "macos", name: "macOS", label: "Scarica per Mac", href: null },
    { platform: "windows", name: "Windows", label: "Scarica per Windows", href: null },
    { platform: "ios", name: "iOS", label: "Scarica per iPhone", href: null },
  ] satisfies PlatformCta[],
} as const;

/** Prefix a path inside the site with the configured base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
