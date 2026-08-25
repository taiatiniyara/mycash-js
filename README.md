# mycash-js

Zero-dependency TypeScript SDK for the [MyCash e-Commerce API](https://www.digicelgroup.com). Accept mobile money payments in minutes.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/mycash-js)](https://www.npmjs.com/package/mycash-js)

[Documentation](https://taiatiniyara.github.io/mycash-js/) · [GitHub](https://github.com/taiatiniyara/mycash-js) · [Issues](https://github.com/taiatiniyara/mycash-js/issues)

## Install

```bash
npm install mycash-js
```

Requires Node.js 18 or later. Also works with Bun, Deno, and edge runtimes.

## Quick Start

```ts
import { MyCashClient } from "mycash-js";

const client = new MyCashClient({
  apiKey: "YOUR_API_KEY",
  username: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  baseUrl: "https://api.mycash.com/v1",
});

const result = await client.pay({
  productId: "PRODUCT-001",
  amount: 25.0,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Order #123 — 2x Widgets",
  orderId: "ORDER-123",
  sendOtp: async (requestId) => {
    // Show your OTP input UI, return the code
    return "123456";
  },
});

console.log(result.transactionId);
```

## Features

- **Zero dependencies** — pure fetch + TypeScript, no polyfills
- **Fully typed** — every request, response, and error is typed
- **Two-layer design** — `MyCash` (core) for raw control, `MyCashClient` for a high-level `pay()` flow
- **camelCase in, snake_case on the wire** — idiomatic TypeScript, automatic translation
- **Client-side validation** — catches bad inputs before hitting the network
- **Injectable fetch** — use the built-in fetch or pass your own for testing

## Core Usage

For full control over each API method:

```ts
import { MyCash } from "mycash-js";

const mycash = new MyCash({
  apiKey: "YOUR_API_KEY",
  username: "YOUR_USERNAME",
  password: "YOUR_PASSWORD",
  baseUrl: "https://api.mycash.com/v1",
});

// Step 1: Create payment request
const { requestId } = await mycash.paymentRequest({
  productId: "PRODUCT-001",
  amount: 100.0,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "Products:10|Total:100|Cust:John",
  orderId: "ORDER-456",
});

// Step 2: Send OTP
await mycash.sendOtp({ mobileNumber: "+67570000000" });

// Step 3: Approve
const result = await mycash.approvePayment({
  requestId,
  otp: "654321",
  customerMobile: "+67570000000",
});
```

## Error Handling

```ts
import { MyCashApiError, MyCashNetworkError, MyCashValidationError } from "mycash-js";

try {
  await client.pay({ ... });
} catch (error) {
  if (error instanceof MyCashApiError) {
    console.log(error.code); // "603"
    console.log(error.message); // "MyCash Payment system error"
  } else if (error instanceof MyCashNetworkError) {
    console.log(error.cause); // underlying Error
  } else if (error instanceof MyCashValidationError) {
    console.log(error.field); // "amount"
  }
}
```

## API Flow

```
paymentRequest  →  sendOTP  →  approvePayment
    ↓                  ↓              ↓
 requestId         OTP sent     transactionId
                                    fee
                              referenceNumber
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
