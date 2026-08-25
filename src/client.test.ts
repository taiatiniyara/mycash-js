import { describe, it, expect, vi } from "vitest";
import { MyCashClient } from "./client.js";
import { MyCashApiError, MyCashNetworkError, MyCashValidationError } from "./errors.js";

function createMockFetch(responses: Record<string, unknown>[]) {
  let callIndex = 0;
  return vi.fn(async (_url: string, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    const method = body.method;

    for (const resp of responses) {
      if (resp._method === method || !resp._method) {
        callIndex++;
        const { _method: _, ...data } = resp;
        return Response.json(data);
      }
    }

    return Response.json({ response_code: "0" });
  });
}

function paymentRequestResponse(requestId = "req_123") {
  return {
    _method: "paymentRequest",
    response_code: "0",
    request_id: requestId,
    message: "Payment request created",
  };
}

function sendOtpResponse() {
  return {
    _method: "sendOTP",
    response_code: "0",
    message: "OTP sent",
  };
}

function approvePaymentResponse() {
  return {
    _method: "approvePayment",
    response_code: "0",
    message: "Success",
    reference_number: "ref_456",
    transaction_id: "txn_789",
    amount_debit: "100.00",
    amount_credit: "95.00",
    fee: "5.00",
  };
}

const config = {
  apiKey: "test-key",
  username: "test-user",
  password: "test-pass",
  baseUrl: "https://api.test.com/v1",
};

describe("MyCashClient", () => {
  describe("pay()", () => {
    it("performs the full 3-step flow", async () => {
      const mockFetch = createMockFetch([
        paymentRequestResponse("req_abc"),
        sendOtpResponse(),
        approvePaymentResponse(),
      ]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      const result = await client.pay({
        productId: "P1",
        amount: 100,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test order",
        orderId: "ORDER-1",
        sendOtp: async () => "654321",
      });

      expect(result.transactionId).toBe("txn_789");
      expect(result.referenceNumber).toBe("ref_456");
      expect(result.amountDebit).toBe("100.00");
      expect(result.amountCredit).toBe("95.00");
      expect(result.fee).toBe("5.00");
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("calls sendOtp callback with requestId", async () => {
      const mockFetch = createMockFetch([
        paymentRequestResponse("req_xyz"),
        sendOtpResponse(),
        approvePaymentResponse(),
      ]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      const sendOtpSpy = vi.fn(async () => "111111");

      await client.pay({
        productId: "P1",
        amount: 50,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
        sendOtp: sendOtpSpy,
      });

      expect(sendOtpSpy).toHaveBeenCalledWith("req_xyz");
    });

    it("propagates API errors from paymentRequest", async () => {
      const mockFetch = createMockFetch([
        { _method: "paymentRequest", response_code: "604", message: "Invalid Product" },
      ]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      await expect(
        client.pay({
          productId: "BAD",
          amount: 10,
          customerMobile: "+67570000000",
          merchantMobile: "+67571111111",
          narration: "Test",
          orderId: "O1",
          sendOtp: async () => "123456",
        }),
      ).rejects.toThrow(MyCashApiError);
    });

    it("propagates network errors", async () => {
      const mockFetch = vi.fn(async () => {
        throw new TypeError("fetch failed");
      });
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      await expect(
        client.pay({
          productId: "P1",
          amount: 10,
          customerMobile: "+67570000000",
          merchantMobile: "+67571111111",
          narration: "Test",
          orderId: "O1",
          sendOtp: async () => "123456",
        }),
      ).rejects.toThrow(MyCashNetworkError);
    });

    it("propagates validation errors", async () => {
      const client = new MyCashClient({ ...config, fetch: createMockFetch([]) });

      await expect(
        client.pay({
          productId: "",
          amount: -1,
          customerMobile: "",
          merchantMobile: "",
          narration: "",
          orderId: "",
          sendOtp: async () => "123456",
        }),
      ).rejects.toThrow(MyCashValidationError);
    });
  });

  describe("delegated methods", () => {
    it("paymentRequest delegates to core", async () => {
      const mockFetch = createMockFetch([paymentRequestResponse("req_del")]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      const result = await client.paymentRequest({
        productId: "P1",
        amount: 10,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test",
        orderId: "O1",
      });

      expect(result.requestId).toBe("req_del");
    });

    it("sendOtp delegates to core", async () => {
      const mockFetch = createMockFetch([sendOtpResponse()]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      const result = await client.sendOtp({
        mobileNumber: "+67570000000",
      });

      expect(result.message).toBe("OTP sent");
    });

    it("approvePayment delegates to core", async () => {
      const mockFetch = createMockFetch([approvePaymentResponse()]);
      const client = new MyCashClient({ ...config, fetch: mockFetch });

      const result = await client.approvePayment({
        requestId: "req_123",
        otp: "654321",
        customerMobile: "+67570000000",
      });

      expect(result.transactionId).toBe("txn_789");
    });
  });
});
