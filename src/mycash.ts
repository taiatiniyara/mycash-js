import type {
  ApprovePaymentParams,
  ApprovePaymentResponse,
  MyCashConfig,
  PaymentRequestParams,
  PaymentRequestResponse,
  SendOtpParams,
  SendOtpResponse,
} from "./types.js";
import { MyCashApiError, MyCashNetworkError, MyCashValidationError } from "./errors.js";
import {
  encodeApprovePayment,
  encodePaymentRequest,
  encodeSendOtp,
  decodeApprovePayment,
  decodePaymentRequest,
  decodeSendOtp,
  type WireRecord,
} from "./wire.js";

function requireField(value: string, field: string): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new MyCashValidationError(field, `${field} is required`);
  }
}

function validatePaymentRequest(params: PaymentRequestParams): void {
  requireField(params.productId, "productId");

  if (typeof params.amount !== "number" || params.amount <= 0) {
    throw new MyCashValidationError(
      "amount",
      "amount must be a positive number",
    );
  }

  requireField(params.customerMobile, "customerMobile");
  requireField(params.merchantMobile, "merchantMobile");

  if (params.narration.length > 200) {
    throw new MyCashValidationError(
      "narration",
      "narration must be 200 characters or fewer",
    );
  }

  requireField(params.orderId, "orderId");
}

function validateApprovePayment(params: ApprovePaymentParams): void {
  requireField(params.requestId, "requestId");
  requireField(params.otp, "otp");
  requireField(params.customerMobile, "customerMobile");
}

function validateSendOtp(params: SendOtpParams): void {
  requireField(params.mobileNumber, "mobileNumber");
}

export class MyCash {
  readonly #config: MyCashConfig;

  constructor(config: MyCashConfig) {
    this.#config = Object.freeze({ ...config });
  }

  async #exchange<T>(
    body: WireRecord,
    decode: (data: WireRecord) => T,
  ): Promise<T> {
    const { fetch: fetchFn = globalThis.fetch, baseUrl } = this.#config;

    let response: Response;
    try {
      response = await fetchFn(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new MyCashNetworkError("Network request failed", { cause: err });
    }

    let data: WireRecord;
    try {
      data = await response.json() as WireRecord;
    } catch (err) {
      throw new MyCashNetworkError("Failed to parse response JSON", {
        cause: err,
      });
    }

    const responseCode = data.response_code as string;
    if (responseCode !== "0") {
      throw new MyCashApiError(
        responseCode,
        (data.message as string) || `API error ${responseCode}`,
      );
    }

    return decode(data);
  }

  async paymentRequest(
    params: PaymentRequestParams,
  ): Promise<PaymentRequestResponse> {
    validatePaymentRequest(params);

    return this.#exchange(
      encodePaymentRequest(params, this.#config),
      decodePaymentRequest,
    );
  }

  async sendOtp(params: SendOtpParams): Promise<SendOtpResponse> {
    validateSendOtp(params);

    return this.#exchange(encodeSendOtp(params, this.#config), decodeSendOtp);
  }

  async approvePayment(
    params: ApprovePaymentParams,
  ): Promise<ApprovePaymentResponse> {
    validateApprovePayment(params);

    return this.#exchange(
      encodeApprovePayment(params, this.#config),
      decodeApprovePayment,
    );
  }
}
