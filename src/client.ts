import type {
  MyCashConfig,
  PaymentRequestParams,
  PaymentRequestResponse,
  SendOtpParams,
  SendOtpResponse,
  ApprovePaymentParams,
  ApprovePaymentResponse,
} from "./types.js";
import { MyCash } from "./mycash.js";

export interface PayParams {
  productId: string;
  amount: number;
  customerMobile: string;
  merchantMobile: string;
  narration: string;
  orderId: string;
  sendOtp: (requestId: string) => Promise<string>;
}

export class MyCashClient {
  readonly #core: MyCash;

  constructor(config: MyCashConfig) {
    this.#core = new MyCash(config);
  }

  async pay(params: PayParams): Promise<ApprovePaymentResponse> {
    const { sendOtp: sendOtpCallback, ...paymentParams } = params;

    const { requestId } = await this.#core.paymentRequest(paymentParams);

    await this.#core.sendOtp({ mobileNumber: params.customerMobile });

    const otp = await sendOtpCallback(requestId);

    return this.#core.approvePayment({
      requestId,
      otp,
      customerMobile: params.customerMobile,
    });
  }

  paymentRequest(
    params: PaymentRequestParams,
  ): Promise<PaymentRequestResponse> {
    return this.#core.paymentRequest(params);
  }

  sendOtp(params: SendOtpParams): Promise<SendOtpResponse> {
    return this.#core.sendOtp(params);
  }

  approvePayment(
    params: ApprovePaymentParams,
  ): Promise<ApprovePaymentResponse> {
    return this.#core.approvePayment(params);
  }
}
