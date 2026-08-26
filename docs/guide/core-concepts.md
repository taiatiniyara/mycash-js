---
title: Core Concepts
description: One client for the whole Payment flow, camelCase↔snake_case translation at the wire seam, client-side validation, and immutable config — the ideas behind mycash-js.
---

# Core concepts

mycash-js has a deliberately small surface: one client class, a handful of types, and one convention. Understanding these four ideas covers 95% of the SDK.

## Two layers, one package

```text
┌─────────────────────────────────────────────┐
│  MyCashClient        (high-level)           │
│  pay() — orchestrates the whole flow        │
│  paymentRequest() / sendOtp() / approve...  │
├─────────────────────────────────────────────┤
│  fetch → MyCash gateway (snake_case wire)   │
└─────────────────────────────────────────────┘
```

**`MyCashClient`** is the SDK. Its `pay()` method runs the full three-step gateway sequence and hands you the final transaction details — you plug in one callback for OTP collection. It also exposes each step individually (`paymentRequest`, `sendOtp`, `approvePayment`) for custom retry logic, non-standard sequencing (e.g. re-sending an expired OTP), or per-step instrumentation.

::: warning The core `MyCash` class is deprecated
`MyCash` was deprecated in v2.0 and will be removed in v3.0. `MyCashClient` exposes every method `MyCash` did, so migrating is a find-and-replace of the constructor.
:::

::: tip Rule of thumb
Use `MyCashClient`. For flows `pay()` doesn't fit, call its individual step methods directly.
:::

## camelCase in, snake_case on the wire

The MyCash API uses snake_case (`customer_mobile`, `request_id`, `response_code`). The SDK treats that as a wire-format detail and never exposes it:

```ts
// You write idiomatic TypeScript...
await mycash.paymentRequest({
  customerMobile: "+67570000000",
});

// ...and the SDK sends:
// { "method": "paymentRequest", "customer_mobile": "+67570000000", ... }
```

Response keys are converted back to camelCase automatically before they reach your code. Your domain model never sees an underscore.

::: info One exception you'll notice
The error class property `.code` holds the API's `response_code` value. That's intentional — see [error handling](/guide/error-handling#api-error-codes).
:::

## Client-side validation

Every request passes validation **before** any network call. Fail fast with a precise message instead of a round-trip to a generic gateway error:

| Rule | Example failure |
| --- | --- |
| Required fields present | missing `orderId` → `"orderId is required"` |
| Amounts are positive numbers | `amount: -5` → `"amount must be a positive number"` |
| Narration ≤ 200 characters | 201-char narration → rejected locally |

Validation errors are thrown as [`MyCashValidationError`](/guide/error-handling) with a `field` property naming the offending input.

## Immutable config

Credentials and settings are supplied once at construction and can't be mutated afterwards:

```ts
const client = new MyCashClient({
  apiKey: "...",
  username: "...",
  password: "...",
  baseUrl: "https://api.mycash.com/v1",
  // optional: inject a custom fetch (testing, proxies)
  fetch: myCustomFetch,
});
```

Need different credentials for a second merchant? Create a second instance — there's no shared global state.

## Type reference

All types are exported from the package root:

```ts
import type {
  MyCashConfig,            // constructor config
  PayParams,               // pay() params incl. sendOtp callback
  PaymentRequestParams,    // step 1
  SendOtpParams,           // step 2
  ApprovePaymentParams,    // step 3
  PaymentRequestResponse,  // { requestId }
  SendOtpResponse,         // { message }
  ApprovePaymentResponse,  // transactionId, fee, amounts...
} from "mycash-js";
```

## Next steps

- [Error handling](/guide/error-handling) — the typed error hierarchy
- [Testing](/guide/testing) — mock the gateway end-to-end
