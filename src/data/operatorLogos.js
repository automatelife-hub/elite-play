/**
 * Operator Logo Registry — DAR-84
 *
 * Maps operator slugs to their local logo file paths.
 * All logos are in public/logos/ and served from /logos/ at runtime.
 *
 * Usage:
 *   import { getOperatorLogo, OPERATOR_LOGOS } from "@/data/operatorLogos";
 *   <img src={getOperatorLogo("ggpoker")} alt="GGPoker" />
 */

export const OPERATOR_LOGOS = {
  // Poker
  "888poker":        "/logos/888poker.png",
  "acr-poker":       "/logos/acr-poker.png",
  "betonline":       "/logos/betonline.png",
  "blackchippoker":  "/logos/blackchippoker.png",
  "bodog":           "/logos/bodog.png",
  "bovada":          "/logos/bovada.png",
  "bwin":            "/logos/bwin.png",
  "championpoker":   "/logos/championpoker.png",
  "coinpoker":       "/logos/coinpoker.png",
  "cristalpoker":    "/logos/cristalpoker.jpg",
  "everygame":       "/logos/everygame.png",
  "ggpoker":         "/logos/ggpoker.jpg",
  "guts":            "/logos/guts.jpg",
  "ignition":        "/logos/ignition.jpg",
  "jackpoker":       "/logos/jackpoker.jpg",
  "ladbrokes":       "/logos/ladbrokes.jpg",
  "natural8":        "/logos/natural8.png",
  "nordicbet":       "/logos/nordicbet.jpg",
  "partypoker":      "/logos/partypoker.png",
  "phenom":          "/logos/phenom.png",
  "pokerdom":        "/logos/pokerdom.jpg",
  "pokerking":       "/logos/pokerking.jpg",
  "qq":              "/logos/qq.png",
  "redstar":         "/logos/redstar.png",
  "rounder":         "/logos/rounder.png",
  "sealswithclubs":  "/logos/sealswithclubs.png",
  "sportsbetting":   "/logos/sportsbetting.png",

  // Other
  "betfair":         "/logos/betfair.png",
  "betkings":        "/logos/betkings.png",
  "betsafe":         "/logos/betsafe.png",
  "betsson":         "/logos/betsson.png",
  "binance":         "/logos/binance.png",
  "kucoin":          "/logos/kucoin.jpg",
};

/**
 * Get operator logo path by slug. Returns null if not found.
 */
export function getOperatorLogo(slug) {
  return OPERATOR_LOGOS[slug] ?? null;
}

/**
 * Get operator logo path with fallback initial letter.
 * Returns { src, fallbackLetter }.
 */
export function getOperatorLogoWithFallback(slug, name) {
  const src = OPERATOR_LOGOS[slug];
  return {
    src: src ?? null,
    fallbackLetter: (name ?? slug ?? "?").charAt(0).toUpperCase(),
  };
}
