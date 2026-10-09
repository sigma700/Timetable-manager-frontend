import React from "react";
import {Helmet} from "react-helmet";
import {useLocation} from "react-router-dom";
import {
  getStructuredData,
  PRIVATE_PAGES,
  PUBLIC_PAGES,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
} from "./metadata";

export default function PageSeo({privateRoute = false}) {
  const {pathname} = useLocation();
  const page = PUBLIC_PAGES[pathname];
  const privateTitle = PRIVATE_PAGES[pathname];

  if (privateRoute || privateTitle || !page) {
    return (
      <Helmet>
        <title>{privateTitle ? `${privateTitle} | Protiba` : "Page not found | Protiba"}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
    );
  }

  const canonicalUrl = `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
  const structuredData = JSON.stringify(getStructuredData(pathname, page)).replace(
    /</g,
    "\\u003c",
  );

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="robots" content="index,follow,max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Protiba" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={SOCIAL_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={page.imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={SOCIAL_IMAGE} />
      <script type="application/ld+json">{structuredData}</script>
    </Helmet>
  );
}