---
title: Error Handling
description: Typed error hierarchy for the MyCash API — validation, network, and gateway errors with machine-readable codes (600–607) and recovery patterns.
---

# Error handling

Payments fail for real reasons: typos in product IDs, expired OTPs, flaky networks, gateway outages. mycash-js turns each failure mode into a typed error you can branch on.

## The hierarchy

Every error the SDK throws extends one base class:

```text
MyCashError
├── MyCashValidationError   — bad input, before any network call
├── MyCashNetworkError      — fetch failed / timeout / invalid or malformed gateway response
└── MyCashApiError          — gateway responded with an error code
```

Catch `MyCashError` to cover everything the SDK can throw, or narrow to a subclass when the recovery differs.

## Branching on error type

```ts
import {
  MyCashError,
  MyCashApiError,
  MyCashNetworkError,
  MyCashValidationError,
} from "mycash-js";

try {
  const result = await client.pay({ /* ... */ });
} catch (error) {
  if (error instanceof MyCashApiError) {
    // Gateway rejected the request.
    console.log(error.code);    // "603" — machine-readable API code
    console.log(error.message); // "MyCash Payment system error"
  } else if (error instanceof MyCashNetworkError) {
    // Request never completed. Safe to retry with backoff.
    console.log(error.cause);   // the underlying Error
  } else if (error instanceof MyCashValidationError) {
    // Your input was bad. Fix it before retrying.
    console.log(error.field);   // "amount"
    console.log(error.message); // "amount must be a positive number"
  } else if (error instanceof MyCashError) {
    // Catch-all for any other SDK failure.
  }
}
```

## What to do with each type

| Error | Typical cause | Suggested recovery |
| --- | --- | --- |
| `MyCashValidationError` | Bug or bad user input | Fix the input; **don't** blind-retry |
| `MyCashNetworkError` | Timeout, DNS, 5xx from a proxy | Retry with exponential backoff |
| `MyCashApiError` (`604`) | Wrong/unknown product ID | Configuration problem; alert, don't retry |
| `MyCashApiError` (OTP-related) | Customer mistyped or OTP expired | Re-prompt the customer for a fresh OTP |

## API error codes

`MyCashApiError.code` contains the gateway's `response_code`. These are the documented codes:

| Code | Description | Common fix |
| --- | --- | --- |
| `600` | API Key Error | Check your `apiKey` config |
| `601` | Invalid User key (user doesn't match API key) | Username doesn't belong to this API key |
| `602` | Invalid Method passed | SDK bug — please [open an issue](https://github.com/taiatiniyara/mycash-js/issues) |
| `603` | MyCash Payment system error | Generic failure; check step order and params |
| `604` | Invalid Product ID | Verify `productId` with MyCash support |
| `605` | Mandatory parameter is empty | A required field was blank — validation should catch this first |
| `606` | Invalid customer mobile number | Confirm the customer's registered number format |
| `607` | Product is not enabled for this transaction | Ask MyCash to enable the product |

::: tip Show gateway messages verbatim
When displaying failures to customers, surface the API's message text unaltered. If the customer calls the MyCash call centre, the exact message helps support locate the transaction.
:::

## Pattern: retry network errors only

```ts
async function payWithRetry(params: PayParams, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await client.pay(params);
    } catch (error) {
      const retryable = error instanceof MyCashNetworkError;
      if (!retryable || i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 2 ** i * 500));
    }
  }
}
```

::: warning Never auto-retry approvePayment blindly
A network failure after approval is ambiguous — the payment may have succeeded even though you never saw the response. For money movement, reconcile by `orderId` with MyCash before re-attempting.
:::
