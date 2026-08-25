export const version = "0.1.0";

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
