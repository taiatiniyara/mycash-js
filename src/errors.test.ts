import { describe, it, expect } from "vitest";
import {
  MyCashError,
  MyCashApiError,
  MyCashNetworkError,
  MyCashValidationError,
} from "./errors.js";

describe("MyCashError", () => {
  it("is an Error subclass", () => {
    const err = new MyCashError("something broke");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(MyCashError);
    expect(err.message).toBe("something broke");
    expect(err.name).toBe("MyCashError");
  });
});

describe("MyCashApiError", () => {
  it("carries a code and message", () => {
    const err = new MyCashApiError("603", "Payment system error");
    expect(err).toBeInstanceOf(MyCashError);
    expect(err).toBeInstanceOf(MyCashApiError);
    expect(err.code).toBe("603");
    expect(err.message).toBe("Payment system error");
    expect(err.name).toBe("MyCashApiError");
  });
});

describe("MyCashNetworkError", () => {
  it("wraps an underlying cause", () => {
    const cause = new Error("fetch failed");
    const err = new MyCashNetworkError("network error", { cause });
    expect(err).toBeInstanceOf(MyCashError);
    expect(err).toBeInstanceOf(MyCashNetworkError);
    expect(err.cause).toBe(cause);
    expect(err.name).toBe("MyCashNetworkError");
  });

  it("works without a cause", () => {
    const err = new MyCashNetworkError("network error");
    expect(err.cause).toBeUndefined();
  });
});

describe("MyCashValidationError", () => {
  it("carries a field name and message", () => {
    const err = new MyCashValidationError("amount", "must be positive");
    expect(err).toBeInstanceOf(MyCashError);
    expect(err).toBeInstanceOf(MyCashValidationError);
    expect(err.field).toBe("amount");
    expect(err.message).toBe("must be positive");
    expect(err.name).toBe("MyCashValidationError");
  });
});
