import { readFileSync } from "node:fs";
import { defineConfig } from "vitepress";

const version = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf-8"),
).version;

const origin = "https://taiatiniyara.github.io";
const siteUrl = `${origin}/mycash-js`;
const description =
  "Zero-dependency TypeScript SDK for the MyCash e-Commerce API. Typed payment requests, OTP delivery, and approvals — ship mobile money payments in minutes.";

export default defineConfig({
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  },
  base: "/mycash-js/",
  title: "mycash-js",
  description,
  srcExclude: ["agents/**/*.md"],
  // VitePress resolves bare page paths ("guide/faq.html") against this URL,
  // so it must include the base path AND end with a slash
  sitemap: { hostname: `${siteUrl}/` },
  head: [
    ["meta", { name: "theme-color", content: "#e11d48" }],

    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "mycash-js" }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:locale", content: "en_US" }],

    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:title",
        content: "mycash-js — Accept MyCash Payments in TypeScript",
      },
    ],
    ["meta", { name: "twitter:description", content: description }],

    // Structured data (JSON-LD)
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "mycash-js",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Node.js 18+, Bun, Deno, Edge runtimes",
        softwareVersion: version,
        description,
        url: `${siteUrl}/`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        license: "https://opensource.org/licenses/MIT",
        codeRepository: "https://github.com/taiatiniyara/mycash-js",
      }),
    ],
  ],
  transformHead({ pageData }) {
    // Per-page canonical + og:url
    const path = pageData.relativePath
      .replace(/(^|\/)index\.md$/, "$1")
      .replace(/\.md$/, ".html");
    const url = path ? `${siteUrl}/${path}` : `${siteUrl}/`;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
    ];
  },
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Why", link: "/guide/why" },
      { text: "FAQ", link: "/guide/faq" },
      { text: `v${version}`, link: "https://github.com/taiatiniyara/mycash-js/releases" },
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Why mycash-js?", link: "/guide/why" },
        ],
      },
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Core concepts", link: "/guide/core-concepts" },
          { text: "Error handling", link: "/guide/error-handling" },
          { text: "Testing", link: "/guide/testing" },
          { text: "FAQ", link: "/guide/faq" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/taiatiniyara/mycash-js" },
    ],
    editLink: {
      pattern:
        "https://github.com/taiatiniyara/mycash-js/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Tiniyara",
    },
    outline: {
      level: [2, 3],
      label: "On this page",
    },
  },
});
