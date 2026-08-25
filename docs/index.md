---
layout: home

hero:
  name: mycash-js
  text: Accept MyCash payments in TypeScript
  tagline: Zero-dependency SDK for the MyCash e-Commerce API. Send OTP, create payment requests, and approve transactions — in minutes, not days.
  actions:
    - theme: brand
      text: Get started
      link: "#quickstart"
    - theme: alt
      text: View on GitHub
      link: https://github.com/taiatiniyara/mycash-js

features:
  - title: Zero dependencies
    details: Pure fetch + TypeScript. No polyfills, no audit surface. Runs on Node 18+, Bun, Deno, and edge runtimes.
  - title: Fully typed
    details: Every request and response is typed. Autocomplete for config, method params, and response fields. TypeScript errors at compile time, not runtime.
  - title: Two-layer design
    details: MyCash (core) for raw control, MyCashClient for a high-level pay() flow. Use whichever fits your integration.
---

## Quickstart

Install, configure, and process your first payment in three steps.

::: code-group

```bash [npm]
npm install mycash-js
```

```bash [yarn]
yarn add mycash-js
```

```bash [pnpm]
pnpm add mycash-js
```

:::

Requires Node.js 18 or later.

```ts
import { MyCashClient } from "mycash-js";

const client = new MyCashClient({
  apiKey: "YOUR_API_KEY",
  username: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  baseUrl: "https://api.mycash.com/v1",
});

// 1. Create a payment request and send OTP
const pending = await client.pay({
  productId: "PRODUCT-001",
  amount: 25.0,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Order #123 — 2x Widgets",
  orderId: "ORDER-123",
  sendOtp: async (requestId) => {
    // Show your OTP input UI here, return the code
    return "123456";
  },
});

// 2. Payment approved
console.log(pending.transactionId);
console.log(pending.referenceNumber);
console.log(pending.amountDebit);
console.log(pending.amountCredit);
console.log(pending.fee);
```

## Core package

Use the low-level `MyCash` class for full control over each API method. Useful when you need custom error handling, retries, or a non-standard flow.

```ts
import { MyCash } from "mycash-js";

const mycash = new MyCash({
  apiKey: "YOUR_API_KEY",
  username: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  baseUrl: "https://api.mycash.com/v1",
});

// Step 1: Create a payment request
const { requestId } = await mycash.paymentRequest({
  productId: "PRODUCT-001",
  amount: 100.0,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Products:10|Total:100|Cust:John",
  orderId: "ORDER-456",
});

// Step 2: Send OTP to customer
await mycash.sendOtp({
  mobileNumber: "+67570000000",
});

// Step 3: Approve the payment
const result = await mycash.approvePayment({
  requestId,
  otp: "654321",
  customerMobile: "+67570000000",
});

console.log(result.transactionId);
```

## Features

The building blocks for a secure MyCash integration.

<div class="features-grid">

### Zero dependencies

Pure `fetch` + TypeScript. No external packages, no transitive deps, no supply chain risk. Runs anywhere `fetch` is available.

### Fully typed

Every request param, response field, and error code is typed. Autocomplete works everywhere. Mistakes are caught at compile time.

### camelCase in, snake_case on the wire

Write idiomatic TypeScript. The SDK translates `customerMobile` → `customer_mobile` automatically. Responses come back as `camelCase` too.

### Client-side validation

Bad inputs are caught before hitting the network. Required fields, positive amounts, narration length — all validated cheaply.

### Injectable fetch

Pass a custom `fetch` for testing, or use the one built into your runtime. Works with `undici`, `node-fetch`, Cloudflare Workers, or any fetch-compatible implementation.

### Immutable config

Credentials are set once at construction. No accidental mid-flight mutations. If you need different configs, create multiple instances.

</div>

## How it works

Three steps between your server, the customer, and the MyCash gateway.

**paymentRequest**

Your server sends product details, amount, and customer mobile. The gateway queues the transaction and returns a `requestId`. This is your handle for the next steps.

**sendOtp**

The SDK calls `sendOTP` with the customer's mobile number. MyCash sends a one-time PIN via SMS to the customer's phone. Show your OTP input UI and wait for the customer to enter it.

**approvePayment**

The SDK calls `approvePayment` with the `requestId` and OTP. If valid, MyCash processes the payment and returns transaction details: `transactionId`, `referenceNumber`, amounts debited/credited, and the merchant fee.

::: warning
Always verify the `response_code` is `'0'` before treating a transaction as successful. Display error messages to the customer without alteration — it helps with troubleshooting if they call the MyCash call centre.
:::

## Error handling

Every error extends `MyCashError`. Catch the base class for any failure, or specific subclasses when you need to react differently.

```ts
import {
  MyCashError,
  MyCashApiError,
  MyCashNetworkError,
  MyCashValidationError,
} from "mycash-js";

try {
  await client.pay({ ... });
} catch (error) {
  if (error instanceof MyCashApiError) {
    // API returned an error response
    console.log(error.code); // "603"
    console.log(error.message); // "MyCash Payment system error"
  } else if (error instanceof MyCashNetworkError) {
    // Fetch failed, timed out, or JSON parse error
    console.log(error.cause); // underlying Error
  } else if (error instanceof MyCashValidationError) {
    // Input failed client-side validation
    console.log(error.field); // "amount"
    console.log(error.message); // "amount must be a positive number"
  } else if (error instanceof MyCashError) {
    // Unknown MyCash error
    console.log(error.message);
  }
}
```

| Error | When it throws |
| --- | --- |
| `MyCashValidationError` | Bad input before any network call (e.g. missing required field, negative amount) |
| `MyCashNetworkError` | Fetch failed, timed out, or returned invalid JSON |
| `MyCashApiError` | API returned `response_code !== '0'` (e.g. invalid credentials, bad product ID) |

### API error codes

| Code | Description |
| --- | --- |
| 600 | API Key Error |
| 601 | Invalid User key (user doesn't match API key) |
| 602 | Invalid Method passed |
| 603 | MyCash Payment system error |
| 604 | Invalid Product ID |
| 605 | Mandatory parameter is empty |
| 606 | Invalid customer mobile number |

## Testing

Inject a mock `fetch` to test without hitting the real API.

```ts
import { MyCashClient } from "mycash-js";

const mockFetch = async (url: string, init: RequestInit) => {
  const body = JSON.parse(init.body as string);

  if (body.method === "paymentRequest") {
    return Response.json({
      response_code: "0",
      request_id: "req_mock_123",
    });
  }

  if (body.method === "sendOTP") {
    return Response.json({ response_code: "0", message: "OTP sent" });
  }

  if (body.method === "approvePayment") {
    return Response.json({
      response_code: "0",
      message: "Success",
      reference_number: "ref_mock_456",
      transaction_id: "txn_mock_789",
      amount_debit: "100.00",
      amount_credit: "95.00",
      fee: "5.00",
    });
  }

  return Response.json({ response_code: "603", message: "Unknown" });
};

const client = new MyCashClient({
  apiKey: "test",
  username: "test",
  password: "test",
  baseUrl: "https://mock.api/v1",
  fetch: mockFetch,
});
```

---

mycash-js — community SDK for the MyCash e-Commerce API · [Source](https://github.com/taiatiniyara/mycash-js) · [Issues](https://github.com/taiatiniyara/mycash-js/issues)
