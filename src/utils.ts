import { MyCashValidationError } from "./errors.js";
import type {
  PaymentRequestParams,
  ApprovePaymentParams,
  SendOtpParams,
} from "./types.js";

export function camelToSnake(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function transformKeys<T extends Record<string, unknown>>(
  obj: T,
  transformer: (key: string) => string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = transformer(key);
    if (Array.isArray(value)) {
      result[newKey] = value.map((item) =>
        typeof item === "object" && item !== null
          ? transformKeys(item as Record<string, unknown>, transformer)
          : item,
      );
    } else if (typeof value === "object" && value !== null) {
      result[newKey] = transformKeys(
        value as Record<string, unknown>,
        transformer,
      );
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function requireField(
  value: string,
  field: string,
): asserts value is string {
  if (!value || value.trim().length === 0) {
    throw new MyCashValidationError(field, `${field} is required`);
  }
}

export function validatePaymentRequest(params: PaymentRequestParams): void {
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

export function validateApprovePayment(params: ApprovePaymentParams): void {
  requireField(params.requestId, "requestId");
  requireField(params.otp, "otp");
  requireField(params.customerMobile, "customerMobile");
}

export function validateSendOtp(params: SendOtpParams): void {
  requireField(params.mobileNumber, "mobileNumber");
}
