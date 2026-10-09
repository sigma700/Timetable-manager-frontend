export const SITE_ORIGIN = "https://protiba.app";
export const SOCIAL_IMAGE = `${SITE_ORIGIN}/protiba-social-preview.png`;

export const PUBLIC_PAGES = {
  "/": {
    title: "Protiba | School Timetable Software for Schools",
    description:
      "Build conflict-free school timetables in minutes. Protiba helps schools schedule classes, teachers, subjects and rooms in one place.",
    imageAlt: "Protiba school timetable software with a weekly schedule preview",
  },
  "/our-story": {
    title: "Our Story | Protiba School Timetabling",
    description:
      "Meet the people and idea behind Protiba, built to make school timetable planning simpler for administrators and educators.",
    imageAlt: "Protiba, school timetable software built for schools",
  },
  "/resources": {
    title: "School Timetable Resources and Guide | Protiba",
    description:
      "Learn how to plan a school timetable, organize classes and teachers, and use Protiba to build a clear weekly schedule.",
    imageAlt: "Protiba guide to school timetable planning",
  },
  "/contact": {
    title: "Contact Protiba | School Timetable Support",
    description:
      "Talk to the Protiba team about school timetabling, product support, early access, or bringing Protiba to your school.",
    imageAlt: "Contact the Protiba school scheduling team",
  },
  "/demo": {
    title: "See the Protiba Timetable Demo",
    description:
      "Explore how Protiba turns school classes, teachers, subjects and rooms into a weekly timetable and helps prevent scheduling clashes.",
    imageAlt: "Preview a weekly school timetable made with Protiba",
  },
  "/terms": {
    title: "Terms and Conditions | Protiba",
    description:
      "Read the terms and conditions for using Protiba school timetable software and related services.",
    imageAlt: "Protiba terms and conditions",
  },
};

export const PRIVATE_PAGES = {
  "/login": "Sign in",
  "/signup": "Create an account",
  "/verify": "Verify your email",
  "/onboarding": "Set up your school",
  "/app": "School timetable dashboard",
  "/app/timetables": "Your school timetables",
  "/app/create": "Create a school timetable",
  "/app/manual": "Protiba user guide",
  "/app/reports": "School timetable reports",
  "/app/invite": "Invite your team to Protiba",
  "/app/settings/account": "Account settings",
  "/app/settings/preferences": "School scheduling preferences",
};

export function getStructuredData(path, page) {
  const url = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "Protiba",
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/new-protiba-logo.png`,
    description:
      "School timetable software for scheduling classes, teachers, subjects and rooms.",
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: "Protiba",
    publisher: {"@id": `${SITE_ORIGIN}/#organization`},
    inLanguage: "en",
  };
  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: {"@id": `${SITE_ORIGIN}/#website`},
    about: {"@id": `${SITE_ORIGIN}/#software`},
    inLanguage: "en",
  };
  const graph = [organization, website, webPage];
  graph.push({
    "@type": "SoftwareApplication",
    "@id": `${SITE_ORIGIN}/#software`,
    name: "Protiba",
    url: `${SITE_ORIGIN}/`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "School timetable software that helps schools schedule classes, teachers, subjects and rooms and identify timetable conflicts.",
    publisher: {"@id": `${SITE_ORIGIN}/#organization`},
  });

  return {"@context": "https://schema.org", "@graph": graph};
}