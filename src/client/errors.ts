/**
 * PingCode 自定义异常体系
 */

export class PingCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PingCodeError';
  }
}

export class AuthenticationError extends PingCodeError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ApiError extends PingCodeError {
  readonly statusCode: number;
  readonly details?: string;

  constructor(message: string, statusCode: number, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}
