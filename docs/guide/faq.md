---
title: FAQ
description: Frequently asked questions about mycash-js — official status, supported runtimes, credentials, OTP expiry, error 603, and how automated releases work.
---

# FAQ

Quick answers to the questions that come up most often when integrating MyCash with mycash-js.

## General

### Is this an official Digicel SDK?

No. mycash-js is a **community-maintained** open-source project, not affiliated with or endorsed by Digicel Financial Services. It encodes the publicly documented MyCash e-Commerce API contract.

### Which runtimes are supported?

Anything with a spec-compliant `fetch`: Node.js 18+, Bun, Deno, Cloudflare Workers, Vercel Edge, and modern browsers (though you should keep credentials server-side).

### How much does it weigh?

A few KB. There are **zero runtime dependencies** — the SDK uses only built-in `fetch`, `Response`, and `JSON`.

## Integration

### Where do I get API credentials?

From MyCash / Digicel during merchant onboarding: an API key, a merchant username + password, and one or more product IDs. You'll also need your registered merchant mobile number.

### Should I use `MyCashClient` or `MyCash`?

Use `MyCashClient` — always. Its `pay()` method handles the three-step flow, and its individual step methods cover custom sequencing, per-step retries, or instrumentation. The core `MyCash` class was deprecated in v2.0 and will be removed in v3.0; if you're on it, migrating is just swapping the constructor — every method exists on `MyCashClient`. See [core concepts](/guide/core-concepts#two-layers-one-package).

### Can I use this in the browser?

Technically yes, but **don't**. The client holds your API key and password; anything in a browser is visible to users. Route payment calls through your own backend.

### How do I handle OTP expiry?

The gateway rejects approval if the code has expired. Catch the resulting [`MyCashApiError`](/guide/error-handling), re-send the OTP (`sendOtp`), and prompt the customer again. Never retry approval with the same stale code.

### Why did I get error 603?

`603` is the gateway's generic "payment system error". Common causes:

- Calling steps out of order (e.g. approving before requesting)
- Reusing a consumed `requestId`
- Malformed params the gateway didn't specifically validate

If your step order is correct and it persists, contact MyCash support — and please [open an issue](https://github.com/taiatiniyara/mycash-js/issues) so we can document the cause.

### Amounts come back as strings like `"95.00"` — why?

That's the gateway's native format, preserved verbatim in the response fields. Parse with `Number(result.amountCredit)` when you need arithmetic. We don't silently convert money values to floats.

## Project

### How are releases handled?

Fully automated via [semantic-release](https://semantic-release.gitbook.io/): conventional commits (`feat:`, `fix:`) on `main` determine versions, publish to npm, generate the changelog, and create GitHub Releases. You never bump versions manually.

### How can I contribute?

See [CONTRIBUTING.md](https://github.com/taiatiniyara/mycash-js/blob/main/CONTRIBUTING.md). Good first contributions: docs improvements, test coverage, and documenting new gateway error codes as they surface.

### Found a bug?

[Open an issue](https://github.com/taiatiniyara/mycash-js/issues) with steps to reproduce, expected vs actual behaviour, your Node version, and the full error output.
