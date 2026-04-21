/**
 * Typed error hierarchy.
 *
 * Every error thrown by the SDK extends `PeddlumError` and carries a
 * stable `code` for programmatic handling. Callers inspect `err.code`
 * instead of parsing error messages — messages may change, codes don't.
 */

export type PeddlumErrorCode =
  // Transport / infra
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED'
  // Auth
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_EXPIRED_TOKEN'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_WEAK_PASSWORD'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_PROVIDER_NOT_CONFIGURED'
  // Resources
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  // Data access
  | 'QUERY_FAILED'
  | 'QUERY_TABLE_NOT_FOUND'
  // Generic fallback
  | 'UNKNOWN';

export class PeddlumError extends Error {
  readonly code: PeddlumErrorCode;
  readonly status: number | null;
  readonly details: unknown;

  constructor(
    code: PeddlumErrorCode,
    message: string,
    opts: { status?: number | null; details?: unknown } = {},
  ) {
    super(message);
    this.name = 'PeddlumError';
    this.code = code;
    this.status = opts.status ?? null;
    this.details = opts.details;
  }
}

export const isAuthError = (err: unknown): err is PeddlumError =>
  err instanceof PeddlumError && err.code.startsWith('AUTH_');

export const isNotFound = (err: unknown): err is PeddlumError =>
  err instanceof PeddlumError && err.code === 'NOT_FOUND';

export const isRateLimited = (err: unknown): err is PeddlumError =>
  err instanceof PeddlumError && err.code === 'RATE_LIMITED';
