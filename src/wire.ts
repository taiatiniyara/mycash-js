import type {
  ApprovePaymentParams,
  ApprovePaymentResponse,
  MyCashConfig,
  PaymentRequestParams,
  PaymentRequestResponse,
  SendOtpParams,
  SendOtpResponse,
} from "./types.js";
import { MyCashNetworkError } from "./errors.js";

export type ApiMethod = "paymentRequest" | "sendOTP" | "approvePayment";

export type WireRecord = Record<string, unknown>;

function requireString(data: WireRecord, key: string): string {
  const value = data[key];
  if (typeof value !== "string") {
    throw new MyCashNetworkError(
      `Malformed success response: missing or invalid "${key}"`,
    );
  }
  return value;
}

export function encodePaymentRequest(
  params: PaymentRequestParams,
  config: Pick<MyCashConfig, "apiKey" | "username" | "password">,
): WireRecord {
  return {
    apikey: config.apiKey,
    username: config.username,
    password: config.password,
    method: "paymentRequest",
    product_id: params.productId,
    amount: params.amount,
    customer_mobile: params.customerMobile,
    merchant_mobile: params.merchantMobile,
    narration: params.narration,
    order_id: params.orderId,
  };
}

export function encodeSendOtp(
  params: SendOtpParams,
  config: Pick<MyCashConfig, "apiKey" | "username" | "password">,
): WireRecord {
  return {
    apikey: config.apiKey,
    username: config.username,
    password: config.password,
    method: "sendOTP",
    mobile_number: params.mobileNumber,
  };
}

export function encodeApprovePayment(
  params: ApprovePaymentParams,
  config: Pick<MyCashConfig, "apiKey" | "username" | "password">,
): WireRecord {
  return {
    apikey: config.apiKey,
    username: config.username,
    password: config.password,
    method: "approvePayment",
    request_id: params.requestId,
    otp: params.otp,
    customer_mobile: params.customerMobile,
  };
}

export function decodePaymentRequest(data: WireRecord): PaymentRequestResponse {
  return { requestId: requireString(data, "request_id") };
}

export function decodeSendOtp(data: WireRecord): SendOtpResponse {
  return { message: requireString(data, "message") };
}

export function decodeApprovePayment(
  data: WireRecord,
): ApprovePaymentResponse {
  return {
    message: requireString(data, "message"),
    referenceNumber: requireString(data, "reference_number"),
    transactionId: requireString(data, "transaction_id"),
    amountDebit: requireString(data, "amount_debit"),
    amountCredit: requireString(data, "amount_credit"),
    fee: requireString(data, "fee"),
  };
}
