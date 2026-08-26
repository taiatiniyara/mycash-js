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
