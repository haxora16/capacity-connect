interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Checks if a given action for an identifier exceeds the rate limit.
 *
 * @param identifier IP address, email, or composite key
 * @param action The specific action being limited (e.g., 'login', 'forgot-password')
 * @param limit Maximum allowed attempts within window (default: 5)
 * @param windowMs Time window in milliseconds (default: 5 minutes)
 */
export function checkRateLimit(
  identifier: string,
  action: string,
  limit = 5,
  windowMs = 5 * 60 * 1000
): {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const key = `${action}:${identifier.toLowerCase()}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = oldestTimestamp + windowMs - now;
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(Math.max(1, retryAfterMs / 1000)),
    };
  }

  // Record this attempt
  record.timestamps.push(now);

  return {
    success: true,
    remaining: limit - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}
