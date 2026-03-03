import { describe, it, expect } from 'vitest';

describe('Environment Configuration', () => {
  it('should have the correct structure', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.NEXT_PUBLIC_APP_NAME = 'Test App';

    const { env } = await import('@/config/env');

    expect(env).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_NAME).toBe('Test App');
  });
});
