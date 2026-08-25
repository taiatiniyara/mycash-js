import { describe, it, expect, vi } from "vitest";
import { MyCash } from "./mycash.js";
import { MyCashApiError, MyCashNetworkError, MyCashValidationError } from "./errors.js";

function createMockFetch(response: unknown) {
  return vi.fn(async () => {
    return Response.json(response);
  });
}

describe("MyCash", () => {
  const config = {
    apiKey: "test-key",
    username: "test-user",
    password: "test-pass",
    baseUrl: "https://api.test.com/v1",
  };

  describe("paymentRequest", () => {
    it("returns requestId on success", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        request_id: "req_abc123",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      const result = await mycash.paymentRequest({
        productId: "P1",
        amount: 100,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test payment",
        orderId: "ORDER-1",
      });

      expect(result.requestId).toBe("req_abc123");
      expect(mockFetch).toHaveBeenCalledOnce();
    });

    it("sends correct snake_case body", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        request_id: "req_1",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await mycash.paymentRequest({
        productId: "P1",
        amount: 50,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.product_id).toBe("P1");
      expect(body.customer_mobile).toBe("+67570000000");
      expect(body.merchant_mobile).toBe("+67571111111");
      expect(body.order_id).toBe("O1");
      expect(body.method).toBe("paymentRequest");
    });

    it("throws MyCashApiError on non-zero response_code", async () => {
      const mockFetch = createMockFetch({
        response_code: "604",
        message: "Invalid Product ID",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await expect(
        mycash.paymentRequest({
          productId: "BAD",
          amount: 10,
          customerMobile: "+67570000000",
          merchantMobile: "+67571111111",
          narration: "Test",
          orderId: "O1",
        }),
      ).rejects.toThrow(MyCashApiError);
    });

    it("throws MyCashValidationError for invalid inputs", async () => {
      const mycash = new MyCash({ ...config, fetch: createMockFetch({}) });

      await expect(
        mycash.paymentRequest({
          productId: "",
          amount: -1,
          customerMobile: "",
          merchantMobile: "",
          narration: "",
          orderId: "",
        }),
      ).rejects.toThrow(MyCashValidationError);
    });

    it("throws MyCashNetworkError on fetch failure", async () => {
      const mockFetch = vi.fn(async () => {
        throw new TypeError("fetch failed");
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await expect(
        mycash.paymentRequest({
          productId: "P1",
          amount: 10,
          customerMobile: "+67570000000",
          merchantMobile: "+67571111111",
          narration: "Test",
          orderId: "O1",
        }),
      ).rejects.toThrow(MyCashNetworkError);
    });

    it("throws MyCashNetworkError on invalid JSON", async () => {
      const mockFetch = vi.fn(async () => {
        return new Response("not json");
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await expect(
        mycash.paymentRequest({
          productId: "P1",
          amount: 10,
          customerMobile: "+67570000000",
          merchantMobile: "+67571111111",
          narration: "Test",
          orderId: "O1",
        }),
      ).rejects.toThrow(MyCashNetworkError);
    });
  });

  describe("sendOtp", () => {
    it("returns message on success", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        message: "OTP sent successfully",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      const result = await mycash.sendOtp({
        mobileNumber: "+67570000000",
      });

      expect(result.message).toBe("OTP sent successfully");
    });

    it("sends correct body", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        message: "OK",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await mycash.sendOtp({ mobileNumber: "+67570000000" });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.method).toBe("sendOTP");
      expect(body.mobile_number).toBe("+67570000000");
    });

    it("throws MyCashApiError on failure", async () => {
      const mockFetch = createMockFetch({
        response_code: "606",
        message: "Invalid mobile number",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await expect(
        mycash.sendOtp({ mobileNumber: "invalid" }),
      ).rejects.toThrow(MyCashApiError);
    });

    it("throws MyCashValidationError on missing mobileNumber", async () => {
      const mycash = new MyCash({ ...config, fetch: createMockFetch({}) });

      await expect(mycash.sendOtp({ mobileNumber: "" })).rejects.toThrow(
        MyCashValidationError,
      );
    });
  });

  describe("approvePayment", () => {
    it("returns full response on success", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        message: "Success",
        reference_number: "ref_456",
        transaction_id: "txn_789",
        amount_debit: "100.00",
        amount_credit: "95.00",
        fee: "5.00",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      const result = await mycash.approvePayment({
        requestId: "req_123",
        otp: "654321",
        customerMobile: "+67570000000",
      });

      expect(result.referenceNumber).toBe("ref_456");
      expect(result.transactionId).toBe("txn_789");
      expect(result.amountDebit).toBe("100.00");
      expect(result.amountCredit).toBe("95.00");
      expect(result.fee).toBe("5.00");
    });

    it("sends correct body", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        message: "OK",
        reference_number: "ref_1",
        transaction_id: "txn_1",
        amount_debit: "10",
        amount_credit: "9",
        fee: "1",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await mycash.approvePayment({
        requestId: "req_123",
        otp: "654321",
        customerMobile: "+67570000000",
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.method).toBe("approvePayment");
      expect(body.request_id).toBe("req_123");
      expect(body.otp).toBe("654321");
      expect(body.customer_mobile).toBe("+67570000000");
    });

    it("throws MyCashApiError on failure", async () => {
      const mockFetch = createMockFetch({
        response_code: "603",
        message: "Payment system error",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await expect(
        mycash.approvePayment({
          requestId: "req_123",
          otp: "wrong",
          customerMobile: "+67570000000",
        }),
      ).rejects.toThrow(MyCashApiError);
    });

    it("throws MyCashValidationError on missing fields", async () => {
      const mycash = new MyCash({ ...config, fetch: createMockFetch({}) });

      await expect(
        mycash.approvePayment({
          requestId: "",
          otp: "",
          customerMobile: "",
        }),
      ).rejects.toThrow(MyCashValidationError);
    });
  });

  describe("config immutability", () => {
    it("stores config that cannot be mutated via the instance", () => {
      const mycash = new MyCash(config);
      // Private field means no external access to config
      expect((mycash as Record<string, unknown>).apiKey).toBeUndefined();
      expect((mycash as Record<string, unknown>).baseUrl).toBeUndefined();
    });
  });

  describe("custom fetch injection", () => {
    it("uses injected fetch instead of globalThis.fetch", async () => {
      const mockFetch = createMockFetch({
        response_code: "0",
        request_id: "req_1",
      });
      const mycash = new MyCash({ ...config, fetch: mockFetch });

      await mycash.paymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      });

      expect(mockFetch).toHaveBeenCalledOnce();
    });
  });
});
