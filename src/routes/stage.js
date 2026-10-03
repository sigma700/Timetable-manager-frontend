// routes/stage.js
export const STAGE = Object.freeze({
  SIGNED_OUT: "signedOut",
  UNVERIFIED: "unverified",
  NEEDS_SCHOOL: "needsSchool",
  READY: "ready",
});

export const deriveStage = ({ isAuthenticated, user }) => {
  if (!isAuthenticated || !user) return STAGE.SIGNED_OUT;
  if (!user.isVerified) return STAGE.UNVERIFIED;
  if (!user.school) return STAGE.NEEDS_SCHOOL;
  return STAGE.READY;
};

export const homeForStage = (stage) => {
  switch (stage) {
    case STAGE.UNVERIFIED:
      return "/verify";
    case STAGE.NEEDS_SCHOOL:
      return "/onboarding";
    case STAGE.READY:
      return "/app";
    default:
      return "/login";
  }
};