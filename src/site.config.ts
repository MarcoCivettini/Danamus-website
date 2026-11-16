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

export interface Plan {
  id: string;
  name: string;
  /** Monthly price in euro, VAT included. */
  price: number;
  period: string | null;
  status: "available" | "soon";
  intro: string | null;
  features: readonly string[];
}

export const site = {
  name: "Danamus",
  title: "Danamus · Rivedi solo il gioco delle tue partite di ping pong",
  description:
    "Registri la partita con il telefono, Danamus trova gli scambi e taglia le pause. L'analisi avviene sul tuo dispositivo. Gratis per iPhone, Mac e Windows.",
  locale: "it_IT",
  comingSoonLabel: "In arrivo",
  platforms: [
    { platform: "macos", name: "macOS", label: "Scarica per Mac", href: null },
    { platform: "windows", name: "Windows", label: "Scarica per Windows", href: null },
    { platform: "ios", name: "iOS", label: "Scarica per iPhone", href: null },
  ] satisfies PlatformCta[],
  /** Plans shown on /prezzi. `status: "soon"` shows "In arrivo" and no purchase action. */
  plans: [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: null,
      status: "available",
      intro: null,
      features: [
        "Analisi automatica degli scambi",
        "Editor per rifinire ogni scambio",
        "Esportazione del video con tutti gli scambi",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 5,
      period: "al mese",
      status: "soon",
      intro: "Tutto quello che c'è in Free, più:",
      features: [
        "Esportazione dei singoli scambi come clip separate",
        "Analisi Pro, più precisa",
        "Coda di analisi: aggiungi più video e Danamus li elabora uno dopo l'altro",
        "Caricamento automatico su YouTube",
      ],
    },
  ] satisfies Plan[],
  /**
   * Details shown on /privacy and /termini. Values in [brackets] are placeholders:
   * the public deploy fails (scripts/check-legal.mjs) until they are filled in
   * and `draft` is false. Leave `vat` as "" if it does not apply.
   */
  legal: {
    draft: true,
    controller: "[Nome e cognome o ragione sociale]",
    address: "[Indirizzo]",
    email: "[email di contatto]",
    vat: "[Partita IVA, se presente]",
    updated: "[data ultimo aggiornamento]",
  },
} as const;

/** Price in euro, formatted the Italian way ("5 €", "0 €"). */
export function formatPrice(euro: number): string {
  return `${euro.toLocaleString("it-IT")} €`;
}

/** Prefix a path inside the site with the configured base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
