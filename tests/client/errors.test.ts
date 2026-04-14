import { describe, it, expect } from 'vitest';
import { PingCodeError, AuthenticationError, ApiError } from '../../src/client/errors';

describe('PingCodeError', () => {
  it('should be an instance of Error', () => {
    const err = new PingCodeError('test');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(PingCodeError);
  });

  it('should have correct name and message', () => {
    const err = new PingCodeError('something went wrong');
    expect(err.name).toBe('PingCodeError');
    expect(err.message).toBe('something went wrong');
  });
});

describe('AuthenticationError', () => {
  it('should be an instance of PingCodeError', () => {
    const err = new AuthenticationError('auth failed');
    expect(err).toBeInstanceOf(PingCodeError);
    expect(err).toBeInstanceOf(Error);
  });

  it('should have correct name and message', () => {
    const err = new AuthenticationError('token expired');
    expect(err.name).toBe('AuthenticationError');
    expect(err.message).toBe('token expired');
  });
});

describe('ApiError', () => {
  it('should be an instance of PingCodeError', () => {
    const err = new ApiError('not found', 404);
    expect(err).toBeInstanceOf(PingCodeError);
    expect(err).toBeInstanceOf(Error);
  });

  it('should have statusCode and message', () => {
    const err = new ApiError('server error', 500);
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('server error');
    expect(err.statusCode).toBe(500);
    expect(err.details).toBeUndefined();
  });

  it('should have details when provided', () => {
    const err = new ApiError('bad request', 400, '{"field":"title"}');
    expect(err.statusCode).toBe(400);
    expect(err.details).toBe('{"field":"title"}');
  });
});
