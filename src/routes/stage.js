/**
 * Single source of truth for "which Protiba experience does this person get?"
 *
 * The stage is DERIVED from facts the backend already returns from
 * /api/check-Auth (user.isVerified, user.school). It is never stored, so it
 * cannot drift out of sync with the session.
 *
 *   signedOut  → public marketing site, /login, /signup
 *   unverified → /verify
 *   needsSchool→ /onboarding
 *   ready      → /app
 */
export const STAGE = Object.freeze({
  SIGNED_OUT: "signedOut",
  UNVERIFIED: "unverified",
  NEEDS_SCHOOL: "needsSchool",
  READY: "ready",
});

export const deriveStage = ({isAuthenticated, user}) => {
  if (!isAuthenticated || !user) return STAGE.SIGNED_OUT;
  if (!user.isVerified) return STAGE.UNVERIFIED;
  if (!user.school) return STAGE.NEEDS_SCHOOL;
  return STAGE.READY;
};

// Where a person belongs when they land somewhere their stage doesn't allow.
export const homeForStage = (stage) => {
  switch (stage) {
    case STAGE.UNVERIFIED:
      return "/verify";
    case STAGE.NEEDS_SCHOOL:
      return "/onboarding";
    case STAGE.READY:
      return "/";
    default:
      return "/login";
  }
};
