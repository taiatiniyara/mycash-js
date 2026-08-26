---
title: Getting Started
description: Install mycash-js and process your first MyCash mobile money payment in five minutes — install, credentials, client setup, and the pay() flow.
---

# Getting started

Go from `npm install` to a completed MyCash payment in about five minutes.

## Installation

::: code-group

```bash [npm]
npm install mycash-js
```

```bash [pnpm]
pnpm add mycash-js
```

```bash [yarn]
yarn add mycash-js
```

```bash [bun]
bun add mycash-js
```

:::

**Requirements:** Node.js 18 or later (for native `fetch`). Also works in Bun, Deno, and edge runtimes out of the box.

## Get your credentials

Before writing code, you need three things from MyCash (provided during merchant onboarding):

| Credential | What it is |
| --- | --- |
| **API key** | Identifies your integration with the gateway |
| **Username / password** | Your merchant account credentials |
| **Product ID** | The specific product or service you're charging for |

You'll also need your **merchant mobile number** — the MyCash-registered number that receives the payment.

## Create a client

```ts
import { MyCashClient } from "mycash-js";

const client = new MyCashClient({
  apiKey: process.env.MYCASH_API_KEY!,
  username: process.env.MYCASH_USERNAME!,
  password: process.env.MYCASH_PASSWORD!,
  baseUrl: "https://api.mycash.com/v1",
});
```

::: warning Keep credentials server-side
The client is designed for backend use. Never ship your API key or password to a browser or mobile app — route payment calls through your own API.
:::

## Process your first payment

The high-level [`pay()`](#the-pay-flow) method handles all three gateway steps. You supply one callback: how to collect the OTP from your customer.

```ts
const result = await client.pay({
  productId: "PRODUCT-001",
  amount: 25.0,                          // PGK
  customerMobile: "+67570000000",        // payer's wallet
  merchantMobile: "+67571111111",        // your wallet
  narration: "Order #123 — 2x Widgets",  // max 200 chars
  orderId: "ORDER-123",                  // your reference
  sendOtp: async (requestId) => {
    // Called after the OTP SMS has been sent.
    // Prompt the customer however you like:
    return await promptOtpInput();       // e.g. "654321"
  },
});

console.log(result.transactionId);    // "txn_..."
console.log(result.referenceNumber);  // gateway reference
console.log(result.amountDebit);      // "25.00"
console.log(result.amountCredit);     // what you receive
console.log(result.fee);              // merchant fee
```

That's it. Behind the scenes, `pay()` did:

1. **`paymentRequest`** — queued the transaction, got a `requestId`
2. **`sendOTP`** — triggered the SMS to the customer's phone
3. Waited for your `sendOtp` callback to return the code
4. **`approvePayment`** — finalized with `requestId` + OTP

## The pay() flow visually

```text
Your server                SDK                     MyCash gateway          Customer
    │                       │                            │                   │
    │── pay(params) ──────▶│                            │                   │
    │                       │── paymentRequest ────────▶│                   │
    │                       │◀──── request_id ──────────│                   │
    │                       │── sendOTP ───────────────▶│──── SMS PIN ─────▶│
    │                       │◀──── ok ──────────────────│                   │
    │◀─ sendOtp(requestId) ─│                            │◀── enters PIN ────│
    │── return "654321" ──▶│                            │                   │
    │                       │── approvePayment(otp) ───▶│                   │
    │                       │◀── transaction details ───│                   │
    │◀─ ApprovePaymentResp ─│                            │                   │
```

## Step-by-step alternative

Need custom control — retries around OTP expiry, non-standard sequencing, per-step logging? `MyCashClient` exposes each step individually:

```ts
import { MyCashClient } from "mycash-js";

const client = new MyCashClient({ /* same config */ });

// Step 1: create the payment request
const { requestId } = await client.paymentRequest({
  productId: "PRODUCT-001",
  amount: 100.0,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Products:10|Total:100|Cust:John",
  orderId: "ORDER-456",
});

// Step 2: send the OTP via SMS
await client.sendOtp({ mobileNumber: "+67570000000" });

// Step 3: approve once you have the customer's code
const result = await client.approvePayment({
  requestId,
  otp: "654321",
  customerMobile: "+67570000000",
});
```

::: warning The core `MyCash` class is deprecated
If an older tutorial shows `new MyCash({ ... })`, use `new MyCashClient({ ... })` instead — same config, same methods. `MyCash` will be removed in v3.0.
:::

See [Core concepts](/guide/core-concepts) for the full picture.

## Next steps

- [Error handling](/guide/error-handling) — handle failed payments gracefully
- [Testing](/guide/testing) — simulate the gateway in CI
- [FAQ](/guide/faq) — common questions and gotchas
