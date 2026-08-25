export class MyCashError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "MyCashError";
  }
}

export class MyCashApiError extends MyCashError {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "MyCashApiError";
    this.code = code;
  }
}

export class MyCashNetworkError extends MyCashError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "MyCashNetworkError";
  }
}

export class MyCashValidationError extends MyCashError {
  readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "MyCashValidationError";
    this.field = field;
  }
}
