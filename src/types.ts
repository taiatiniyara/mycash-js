export interface MyCashConfig {
  apiKey: string;
  username: string;
  password: string;
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export interface SendOtpParams {
  mobileNumber: string;
}

export interface PaymentRequestParams {
  productId: string;
  amount: number;
  customerMobile: string;
  merchantMobile: string;
  narration: string;
  orderId: string;
}

export interface ApprovePaymentParams {
  requestId: string;
  otp: string;
  customerMobile: string;
}

export interface PaymentRequestResponse {
  requestId: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface ApprovePaymentResponse {
  message: string;
  referenceNumber: string;
  transactionId: string;
  amountDebit: string;
  amountCredit: string;
  fee: string;
}

export interface WirePaymentRequest {
  method: "paymentRequest";
  product_id: string;
  amount: number;
  customer_mobile: string;
  merchant_mobile: string;
  narration: string;
  order_id: string;
}

export interface WireSendOtp {
  method: "sendOTP";
  mobile_number: string;
}

export interface WireApprovePayment {
  method: "approvePayment";
  request_id: string;
  otp: string;
  customer_mobile: string;
}

export interface WirePaymentRequestResponse {
  response_code: string;
  request_id: string;
  message?: string;
}

export interface WireSendOtpResponse {
  response_code: string;
  message: string;
}

export interface WireApprovePaymentResponse {
  response_code: string;
  message: string;
  reference_number: string;
  transaction_id: string;
  amount_debit: string;
  amount_credit: string;
  fee: string;
}
