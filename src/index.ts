export const version = "1.0.0";

/**
 * @deprecated Use {@link MyCashClient} instead. MyCash will be removed in v3.0.
 */
export { MyCash } from "./mycash.js";
export { MyCashClient } from "./client.js";
export type { PayParams } from "./client.js";

export {
  MyCashError,
  MyCashApiError,
  MyCashNetworkError,
  MyCashValidationError,
} from "./errors.js";

export type {
  MyCashConfig,
  SendOtpParams,
  PaymentRequestParams,
  ApprovePaymentParams,
  PaymentRequestResponse,
  SendOtpResponse,
  ApprovePaymentResponse,
} from "./types.js";
