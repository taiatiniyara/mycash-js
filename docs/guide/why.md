---
title: Why mycash-js?
description: The MyCash e-Commerce API is a raw HTTP gateway — snake_case fields, a three-step payment flow, stringly-typed errors. See how mycash-js solves each problem.
---

# Why mycash-js?

MyCash is Digicel Financial Services' mobile money platform, widely used in Papua New Guinea. Its e-Commerce API lets merchants accept payments from customers' MyCash wallets over HTTP.

The API works. But integrating it directly means absorbing a set of rough edges that have nothing to do with your product.

## The problem with the raw API

### 1. A three-step dance for every payment

There is no "charge the customer" endpoint. Every payment is a stateful sequence:

```text
1. paymentRequest   → gateway queues the transaction, returns request_id
2. sendOTP          → customer receives a PIN via SMS
3. approvePayment   → send back request_id + OTP to finalize
```

Each step has its own payload, its own failure modes, and its own ordering rules. Get it wrong — say, call `approvePayment` before the OTP arrives — and you get a generic `603: MyCash Payment system error` with no hint about *what* was wrong.

mycash-js wraps all three steps in a single [`pay()`](/guide/getting-started#process-your-first-payment) call, with a callback in the middle so you control the OTP UX.

### 2. snake_case on the wire

Every field is `customer_mobile`, `request_id`, `response_code`. In a TypeScript codebase that's a constant source of mapping code — or worse, inconsistent naming that leaks into your domain model.

mycash-js translates both directions:

| You write | SDK sends (wire) | You read back |
| --- | --- | --- |
| `customerMobile` | `customer_mobile` | `customerMobile` |
| `requestId` | `request_id` | `requestId` |
| `response_code` → thrown as error | `response_code` | typed error `.code` |

### 3. Stringly-typed everything

Amounts come back as `"95.00"` strings. Error codes are strings. Response shapes are undocumented at the type level, so a typo like `transaction_Id` compiles fine and fails silently at 2am.

With mycash-js, every param and response field is a TypeScript interface. Typos are compile errors.

### 4. No client-side guardrails

The API rejects empty mandatory fields, negative amounts, and oversized narrations — but only after a network round trip. mycash-js validates before the request leaves your server, throwing a `MyCashValidationError` with the exact offending field name.

## What you get instead

- **One high-level call** (`pay()`) or three explicit low-level calls (`paymentRequest`, `sendOtp`, `approvePayment`) — your choice
- **camelCase in, camelCase out** — the wire format never leaks
- **Typed errors with codes** — distinguish validation, network, and API failures; branch on specific codes like `604` (invalid product)
- **Injectable fetch** — test the full flow against a mock
- **Zero runtime dependencies** — nothing to audit

## Zero dependencies, by design

The SDK uses only what's already in your runtime: `fetch`, `Response`, and `JSON`. That means:

- **No supply-chain risk** — no transitive packages to audit or patch
- **No install bloat** — a few KB of TypeScript
- **Runs anywhere fetch does** — Node 18+, Bun, Deno, Cloudflare Workers, Vercel Edge

::: tip Who is this for?
Any developer integrating MyCash payments on a JavaScript or TypeScript backend — e-commerce sites, billing systems, marketplaces — who wants to spend their time on their product instead of reverse-engineering an HTTP gateway.
:::

## Community, not official

This is a **community-maintained** open-source SDK. It is not affiliated with or endorsed by Digicel. The API contract it encodes comes from the published MyCash e-Commerce documentation; when the gateway changes, we ship fixes as fast as possible via automated releases.

Found a bug or a gap? [Open an issue](https://github.com/taiatiniyara/mycash-js/issues) — or [contribute](https://github.com/taiatiniyara/mycash-js/blob/main/CONTRIBUTING.md).
