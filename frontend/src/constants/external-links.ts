// src/constants/external-links.ts
/**
 * External destinations referenced by the landing page.
 * Kept isolated in one place so URLs stay easy to find and update.
 */
export const EXTERNAL_LINKS = {
  /** Documentation destination — same link used by the Navbar and Hero CTAs. */
  DOCS: "/docs",

  /** Project repository — the only external link currently configured. */
  GITHUB: "https://github.com/delok-dev",

  /**
   * Developer profile.
   * Derived from the repository owner ("yuandadhama") configured in GITHUB
   * above. Swap for a dedicated personal site/profile if one exists.
   */
  DEVELOPER: "https://github.com/yuandadhama",
} as const;
