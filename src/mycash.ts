import type {
  MyCashConfig,
  PaymentRequestParams,
  PaymentRequestResponse,
  SendOtpParams,
  SendOtpResponse,
  ApprovePaymentParams,
  ApprovePaymentResponse,
} from "./types.js";
import { MyCashApiError, MyCashNetworkError } from "./errors.js";
import {
  camelToSnake,
  snakeToCamel,
  transformKeys,
  validatePaymentRequest,
  validateApprovePayment,
  validateSendOtp,
} from "./utils.js";

type ApiMethod = "paymentRequest" | "sendOTP" | "approvePayment";

export class MyCash {
  readonly #config: MyCashConfig;

  constructor(config: MyCashConfig) {
    this.#config = Object.freeze({ ...config });
  }

  async #request<T>(method: ApiMethod, params: Record<string, unknown>): Promise<T> {
    const { fetch: fetchFn = globalThis.fetch, baseUrl, apiKey, username, password } = this.#config;

    const body = {
      apikey: apiKey,
      username,
      password,
      method,
      ...transformKeys(params, camelToSnake),
    };

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

    let data: Record<string, unknown>;
    try {
      data = await response.json() as Record<string, unknown>;
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

    return transformKeys(data, snakeToCamel) as T;
  }

  async paymentRequest(
    params: PaymentRequestParams,
  ): Promise<PaymentRequestResponse> {
    validatePaymentRequest(params);

    const data = await this.#request<Record<string, unknown>>(
      "paymentRequest",
      {
        productId: params.productId,
        amount: params.amount,
        customerMobile: params.customerMobile,
        merchantMobile: params.merchantMobile,
        narration: params.narration,
        orderId: params.orderId,
      },
    );

    return { requestId: data.requestId as string };
  }

  async sendOtp(params: SendOtpParams): Promise<SendOtpResponse> {
    validateSendOtp(params);

    const data = await this.#request<Record<string, unknown>>("sendOTP", {
      mobileNumber: params.mobileNumber,
    });

    return { message: data.message as string };
  }

  async approvePayment(
    params: ApprovePaymentParams,
  ): Promise<ApprovePaymentResponse> {
    validateApprovePayment(params);

    const data = await this.#request<Record<string, unknown>>(
      "approvePayment",
      {
        requestId: params.requestId,
        otp: params.otp,
        customerMobile: params.customerMobile,
      },
    );

    return {
      message: data.message as string,
      referenceNumber: data.referenceNumber as string,
      transactionId: data.transactionId as string,
      amountDebit: data.amountDebit as string,
      amountCredit: data.amountCredit as string,
      fee: data.fee as string,
    };
  }
}
