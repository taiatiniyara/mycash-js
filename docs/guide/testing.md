---
title: Testing
description: Test your MyCash integration end-to-end by injecting a mock fetch — simulate success paths, OTP failures, and network errors without hitting the real API.
---

# Testing

The SDK accepts any `fetch`-compatible function via the config's optional `fetch` property. That single seam is enough to simulate the entire gateway — success paths, OTP rejections, network failures — with no network access and no mocking library required.

## A mock gateway in ~30 lines

```ts
import { MyCashClient } from "mycash-js";
import type { MyCashConfig } from "mycash-js";

const mockFetch = async (url: string, init: RequestInit) => {
  const body = JSON.parse(init.body as string);

  switch (body.method) {
    case "paymentRequest":
      return Response.json({
        response_code: "0",
        request_id: "req_mock_123",
      });

    case "sendOTP":
      return Response.json({ response_code: "0", message: "OTP sent" });

    case "approvePayment":
      return Response.json({
        response_code: "0",
        message: "Success",
        reference_number: "ref_mock_456",
        transaction_id: "txn_mock_789",
        amount_debit: "100.00",
        amount_credit: "95.00",
        fee: "5.00",
      });

    default:
      return Response.json({ response_code: "603", message: "Unknown" });
  }
};

const client = new MyCashClient({
  apiKey: "test",
  username: "test",
  password: "test",
  baseUrl: "https://mock.api/v1",
  fetch: mockFetch,
});
```

::: info Mocks speak snake_case
Your mock replaces the real gateway, so it must return the API's native snake_case fields (`request_id`, `response_code`). The SDK converts them to camelCase on the way out — exactly as it does against the live gateway.
:::

## Testing the full pay() flow

```ts
const result = await client.pay({
  productId: "PRODUCT-001",
  amount: 100,
  customerMobile: "+67570000000",
  merchantMobile: "+67571111111",
  narration: "test order",
  orderId: "ORDER-TEST",
  sendOtp: async () => "654321", // canned OTP
});

expect(result.transactionId).toBe("txn_mock_789");
```

Because `sendOtp` is just a function, you can assert it was called, delay it, or make it fail.

## Simulating failure modes

### Gateway error (e.g. invalid product)

```ts
const failingFetch = async () =>
  Response.json({ response_code: "604", message: "Invalid Product ID" });

await expect(client.pay(params)).rejects.toMatchObject({
  name: "MyCashApiError",
  code: "604",
});
```

### Network failure

```ts
const offlineFetch = async () => {
  throw new Error("ECONNREFUSED");
};

const client = new MyCashClient({ /* ... */ fetch: offlineFetch });

await expect(client.pay(params)).rejects.toBeInstanceOf(MyCashNetworkError);
```

### Validation happens before fetch

Validation errors never touch your injected fetch — a good invariant to test:

```ts
const spyFetch = vi.fn(); // or jest.fn()
const client = new MyCashClient({ /* ... */ fetch: spyFetch });

await expect(
  client.pay({ ...params, amount: -5 }),
).rejects.toMatchObject({ field: "amount" });

expect(spyFetch).not.toHaveBeenCalled();
```

## Tips

- **Assert on the wire body** — parse `init.body` in the mock to verify the SDK sent what you expect (`method`, snake_case keys).
- **One mock per scenario** — build tiny helpers like `fetchApproveFails()` instead of one mega-mock with flags.
- **Reuse the same client** — construct once per suite; instances are stateless between calls.
