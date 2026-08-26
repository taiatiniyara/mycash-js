# mycash-js

Zero-dependency TypeScript SDK for the [MyCash e-Commerce API](https://www.digicelgroup.com). Accept mobile money payments in minutes.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/mycash-js)](https://www.npmjs.com/package/mycash-js)

[Documentation](https://taiatiniyara.github.io/mycash-js/) · [GitHub](https://github.com/taiatiniyara/mycash-js) · [Issues](https://github.com/taiatiniyara/mycash-js/issues)

## Install

```bash
npm install mycash-js
```

Requires Node.js 18+. Also works with Bun, Deno, and edge runtimes.

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
    return "123456"; // collect OTP from your UI
  },
});

console.log(result.transactionId);
```

## Features

- **Zero dependencies** — pure fetch + TypeScript, no polyfills
- **Fully typed** — every request, response, and error is typed
- **One deep client** — `pay()` orchestrates the full Payment flow; each step also exposed individually
- **camelCase in, snake_case on the wire** — idiomatic TypeScript, translation confined to one internal codec
- **Client-side validation** — catches bad inputs before hitting the network
- **Injectable fetch** — use the built-in fetch or pass your own for testing

## Documentation

Full API reference, error handling guide, testing patterns, and more:

**[Read the docs →](https://taiatiniyara.github.io/mycash-js/)**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
