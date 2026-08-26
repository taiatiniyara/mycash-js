import { describe, it, expect } from "vitest";
import {
  encodePaymentRequest,
  encodeSendOtp,
  encodeApprovePayment,
  decodePaymentRequest,
  decodeSendOtp,
  decodeApprovePayment,
} from "./wire.js";
import { MyCashNetworkError } from "./errors.js";

const credentials = {
  apiKey: "test-key",
  username: "test-user",
  password: "test-pass",
};

describe("encode", () => {
  it("encodes paymentRequest with literal snake_case keys", () => {
    const body = encodePaymentRequest(
      {
        productId: "P1",
        amount: 100,
        customerMobile: "+67570000000",
        merchantMobile: "+67571111111",
        narration: "Test payment",
        orderId: "ORDER-1",
      },
      credentials,
    );

    expect(body).toEqual({
      apikey: "test-key",
      username: "test-user",
      password: "test-pass",
      method: "paymentRequest",
      product_id: "P1",
      amount: 100,
      customer_mobile: "+67570000000",
      merchant_mobile: "+67571111111",
      narration: "Test payment",
      order_id: "ORDER-1",
    });
  });

  it("encodes sendOTP with literal snake_case keys", () => {
    const body = encodeSendOtp(
      { mobileNumber: "+67570000000" },
      credentials,
    );

    expect(body).toEqual({
      apikey: "test-key",
      username: "test-user",
      password: "test-pass",
      method: "sendOTP",
      mobile_number: "+67570000000",
    });
  });

  it("encodes approvePayment with literal snake_case keys", () => {
    const body = encodeApprovePayment(
      {
        requestId: "req_123",
        otp: "654321",
        customerMobile: "+67570000000",
      },
      credentials,
    );

    expect(body).toEqual({
      apikey: "test-key",
      username: "test-user",
      password: "test-pass",
      method: "approvePayment",
      request_id: "req_123",
      otp: "654321",
      customer_mobile: "+67570000000",
    });
  });
});

describe("decode", () => {
  it("decodes a paymentRequest success payload", () => {
    expect(
      decodePaymentRequest({ response_code: "0", request_id: "req_abc" }),
    ).toEqual({ requestId: "req_abc" });
  });

  it("decodes a sendOTP success payload", () => {
    expect(decodeSendOtp({ response_code: "0", message: "OTP sent" })).toEqual({
      message: "OTP sent",
    });
  });

  it("decodes an approvePayment success payload", () => {
    expect(
      decodeApprovePayment({
        response_code: "0",
        message: "Success",
        reference_number: "ref_456",
        transaction_id: "txn_789",
        amount_debit: "100.00",
        amount_credit: "95.00",
        fee: "5.00",
      }),
    ).toEqual({
      message: "Success",
      referenceNumber: "ref_456",
      transactionId: "txn_789",
      amountDebit: "100.00",
      amountCredit: "95.00",
      fee: "5.00",
    });
  });

  it("throws MyCashNetworkError naming the missing field", () => {
    expect(() =>
      decodePaymentRequest({ response_code: "0" }),
    ).toThrow(MyCashNetworkError);

    try {
      decodePaymentRequest({ response_code: "0" });
    } catch (err) {
      expect((err as Error).message).toContain('missing or invalid "request_id"');
    }
  });

  it("rejects non-string field values", () => {
    expect(() =>
      decodeApprovePayment({
        message: "Success",
        reference_number: "ref_456",
        transaction_id: 123,
        amount_debit: "100.00",
        amount_credit: "95.00",
        fee: "5.00",
      }),
    ).toThrow(MyCashNetworkError);
  });
});
