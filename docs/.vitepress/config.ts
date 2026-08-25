import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/mycash-js/",
  title: "mycash-js",
  description:
    "Accept MyCash e-Commerce payments in TypeScript. Zero dependencies.",
  head: [
    ["meta", { name: "theme-color", content: "#e11d48" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content: "mycash-js — Accept MyCash Payments in TypeScript",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Zero-dependency TypeScript SDK for the MyCash e-Commerce API. Send OTP, payment requests, and approvals in minutes.",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "Guide", link: "#quickstart" },
      {
        text: "GitHub",
        link: "https://github.com/taiatiniyara/mycash-js",
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
  },
});
