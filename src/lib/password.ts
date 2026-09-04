import argon2 from "argon2";
import bcrypt from "bcryptjs";

/**
 * Hashes a plain-text password using Argon2id.
 * Falls back to bcrypt if argon2 encounters any runtime issues.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
    });
  } catch (err) {
    console.warn("Argon2 hashing fallback to bcrypt:", err);
    return await bcrypt.hash(password, 12);
  }
}

/**
 * Verifies a candidate plain-text password against a stored hash.
 * Supports both Argon2id hashes and legacy/bcrypt hashes.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;

  try {
    if (hash.startsWith("$argon2")) {
      return await argon2.verify(hash, password);
    }
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      return await bcrypt.compare(password, hash);
    }
    // Fallback comparison for unhashed legacy records in dev if any
    return password === hash;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

/**
 * Enforces robust password requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePasswordRequirements(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
