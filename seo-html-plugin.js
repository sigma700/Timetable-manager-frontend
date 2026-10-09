import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import {
  getStructuredData,
  PRIVATE_PAGES,
  PUBLIC_PAGES,
  SITE_ORIGIN,
  SOCIAL_IMAGE,
} from "./src/seo/metadata.js";

function escapeAttribute(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function createSeoHead(path, page, isPrivate = false) {
  if (isPrivate) {
    return `<title>${escapeAttribute(page.title)} | Protiba</title>\n<meta name="robots" content="noindex,nofollow" />`;
  }

  const canonicalUrl = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
  const structuredData = JSON.stringify(getStructuredData(path, page)).replace(
    /</g,
    "\\u003c",
  );

  return `<title>${escapeAttribute(page.title)}</title>
<meta name="description" content="${escapeAttribute(page.description)}" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Protiba" />
<meta property="og:title" content="${escapeAttribute(page.title)}" />
<meta property="og:description" content="${escapeAttribute(page.description)}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${SOCIAL_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${escapeAttribute(page.imageAlt)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeAttribute(page.title)}" />
<meta name="twitter:description" content="${escapeAttribute(page.description)}" />
<meta name="twitter:image" content="${SOCIAL_IMAGE}" />
<script type="application/ld+json">${structuredData}</script>`;
}

export default function seoHtmlPlugin() {
  let outputDirectory;

  return {
    name: "protiba-route-seo-html",
    apply: "build",
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async writeBundle() {
      const indexPath = resolve(outputDirectory, "index.html");
      const template = await readFile(indexPath, "utf8");
      const marker = /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/;
      const rootPage = PUBLIC_PAGES["/"];
      await writeFile(
        indexPath,
        template.replace(
          marker,
          createSeoHead("/", rootPage),
        ),
      );

      const routeDocuments = [];
      for (const [route, page] of Object.entries(PUBLIC_PAGES)) {
        if (route === "/") continue;
        routeDocuments.push({
          route,
          head: createSeoHead(route, page),
        });
      }

      for (const [route, title] of Object.entries(PRIVATE_PAGES)) {
        routeDocuments.push({
          route,
          head: createSeoHead(route, {title}, true),
        });
      }

      await Promise.all(routeDocuments.map(async ({route, head}) => {
        const routeIndex = resolve(outputDirectory, route.slice(1), "index.html");
        await mkdir(dirname(routeIndex), {recursive: true});
        await writeFile(routeIndex, template.replace(marker, head));
      }));
    },
  };
}