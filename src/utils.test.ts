import { describe, it, expect } from "vitest";
import {
  camelToSnake,
  snakeToCamel,
  transformKeys,
  validatePaymentRequest,
  validateApprovePayment,
  validateSendOtp,
} from "./utils.js";

describe("camelToSnake", () => {
  it("converts simple camelCase", () => {
    expect(camelToSnake("camelCase")).toBe("camel_case");
  });

  it("converts PascalCase", () => {
    expect(camelToSnake("PascalCase")).toBe("pascal_case");
  });

  it("leaves snake_case as-is", () => {
    expect(camelToSnake("already_snake")).toBe("already_snake");
  });

  it("handles single word", () => {
    expect(camelToSnake("hello")).toBe("hello");
  });

  it("handles consecutive capitals", () => {
    expect(camelToSnake("parseJSON")).toBe("parse_json");
  });
});

describe("snakeToCamel", () => {
  it("converts simple snake_case", () => {
    expect(snakeToCamel("snake_case")).toBe("snakeCase");
  });

  it("leaves camelCase as-is", () => {
    expect(snakeToCamel("alreadyCamel")).toBe("alreadyCamel");
  });

  it("handles single word", () => {
    expect(snakeToCamel("hello")).toBe("hello");
  });
});

describe("transformKeys", () => {
  it("transforms top-level keys", () => {
    const result = transformKeys(
      { first_name: "John", last_name: "Doe" },
      snakeToCamel,
    );
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });

  it("transforms nested keys", () => {
    const result = transformKeys(
      { user_data: { first_name: "John" } },
      snakeToCamel,
    );
    expect(result).toEqual({ userData: { firstName: "John" } });
  });

  it("handles arrays", () => {
    const result = transformKeys(
      { items: [{ item_name: "A" }, { item_name: "B" }] },
      snakeToCamel,
    );
    expect(result).toEqual({
      items: [{ itemName: "A" }, { itemName: "B" }],
    });
  });

  it("preserves non-object values", () => {
    const result = transformKeys({ count: 42, name: "test" }, snakeToCamel);
    expect(result).toEqual({ count: 42, name: "test" });
  });
});

describe("validatePaymentRequest", () => {
  it("passes with valid params", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      }),
    ).not.toThrow();
  });

  it("throws on missing productId", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      }),
    ).toThrow("productId");
  });

  it("throws on negative amount", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: -5,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      }),
    ).toThrow("amount");
  });

  it("throws on zero amount", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 0,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      }),
    ).toThrow("amount");
  });

  it("throws on narration > 200 chars", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "x".repeat(201),
        orderId: "O1",
      }),
    ).toThrow("narration");
  });

  it("throws on missing customerMobile", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      }),
    ).toThrow("customerMobile");
  });

  it("throws on missing merchantMobile", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "",
        narration: "Test",
        orderId: "O1",
      }),
    ).toThrow("merchantMobile");
  });

  it("throws on missing orderId", () => {
    expect(() =>
      validatePaymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "",
      }),
    ).toThrow("orderId");
  });
});

describe("validateApprovePayment", () => {
  it("passes with valid params", () => {
    expect(() =>
      validateApprovePayment({
        requestId: "req_123",
        otp: "123456",
        customerMobile: "+67570000000",
      }),
    ).not.toThrow();
  });

  it("throws on missing requestId", () => {
    expect(() =>
      validateApprovePayment({
        requestId: "",
        otp: "123456",
        customerMobile: "+67570000000",
      }),
    ).toThrow("requestId");
  });

  it("throws on missing otp", () => {
    expect(() =>
      validateApprovePayment({
        requestId: "req_123",
        otp: "",
        customerMobile: "+67570000000",
      }),
    ).toThrow("otp");
  });

  it("throws on missing customerMobile", () => {
    expect(() =>
      validateApprovePayment({
        requestId: "req_123",
        otp: "123456",
        customerMobile: "",
      }),
    ).toThrow("customerMobile");
  });
});

describe("validateSendOtp", () => {
  it("passes with valid params", () => {
    expect(() =>
      validateSendOtp({ mobileNumber: "+67570000000" }),
    ).not.toThrow();
  });

  it("throws on missing mobileNumber", () => {
    expect(() => validateSendOtp({ mobileNumber: "" })).toThrow(
      "mobileNumber",
    );
  });
});
