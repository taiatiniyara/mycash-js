---
layout: home
title: Accept MyCash Payments in TypeScript
description: Open-source TypeScript SDK for the MyCash e-Commerce API. Typed errors, camelCase API, zero dependencies — accept mobile money payments in minutes.

hero:
  name: mycash-js
  text: Accept MyCash payments in TypeScript
  tagline: The open-source SDK that turns the raw MyCash e-Commerce API into three lines of typed, validated, testable code. No SOAP-style payloads, no snake_case guessing, no undocumented error codes.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Why mycash-js?
      link: /guide/why

features:
  - icon: ⚡
    title: Ship payments in minutes
    details: One pay() call handles the entire flow — payment request, OTP delivery, and approval — with your own UI in the middle.
    link: /guide/getting-started
    linkText: Quickstart
  - icon: 🛡️
    title: Errors you can actually handle
    details: Typed error hierarchy with machine-readable codes. Know instantly whether to retry, re-prompt the customer, or page support.
    link: /guide/error-handling
    linkText: Error handling
  - icon: 🧩
    title: Zero dependencies
    details: Pure fetch + TypeScript. Nothing to audit, nothing to patch. Runs on Node 18+, Bun, Deno, and edge runtimes.
    link: /guide/why#zero-dependencies-by-design
    linkText: Why it matters
  - icon: 🔒
    title: Fully typed end to end
    details: Every config field, request param, response key, and error class is typed. Your editor catches mistakes before your customers do.
    link: /guide/core-concepts
    linkText: Core concepts
  - icon: 🔁
    title: Idiomatic TypeScript
    details: Write camelCase like everywhere else in JS. The SDK translates to the API's snake_case wire format and back — automatically.
    link: /guide/core-concepts#camelcase-in-snake-case-on-the-wire
    linkText: How translation works
  - icon: 🧪
    title: Testable by design
    details: Inject a mock fetch and simulate the whole gateway — success paths, OTP failures, network errors — without touching the real API.
    link: /guide/testing
    linkText: Testing guide
---

<script setup>
const version = __APP_VERSION__
</script>

<div class="version-badge">
  <span>v{{ version }}</span>
</div>

## The problem, in one minute

MyCash is Digicel's mobile money platform in Papua New Guinea — but its e-Commerce API is a raw HTTP gateway designed for server-to-server calls, not developer happiness:

- **snake_case everywhere** — `customer_mobile`, `request_id`, `response_code` — fighting every TypeScript convention you use
- **A three-step dance** for a single payment: create a request, deliver an OTP, approve with the OTP. Miss a step and you get an opaque `603`
- **Stringly-typed everything** — amounts are strings, error codes are strings, and nothing is documented in a way your editor can help with

**mycash-js fixes all of this.** You write idiomatic camelCase TypeScript; the SDK handles the wire format, step sequencing, client-side validation, and typed errors.

```ts
// This is the entire integration
const result = await client.pay({
  productId: "PRODUCT-001",
  amount: 25,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Order #123",
  orderId: "ORDER-123",
  sendOtp: (requestId) => collectOtpFromMyUi(),
});

result.transactionId; // fully typed ✓
```

<div class="cta-row">
  <a href="/guide/why" class="cta-primary">Read why we built this →</a>
  <a href="/guide/getting-started" class="cta-secondary">Jump to quickstart</a>
</div>
