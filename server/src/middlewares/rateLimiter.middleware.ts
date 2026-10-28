import type { NextFunction, Request, Response } from "express";
import redisClient from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";

interface MemoryStoreEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, MemoryStoreEntry>();

// Clean up expired in-memory entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (now > entry.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 60000).unref();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}

export const rateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 20,
    message = "Too many requests, please try again later.",
    keyPrefix = "rl",
  } = options;

  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown_ip";

    const key = `${keyPrefix}:${clientIp}`;

    try {
      if (redisClient.isOpen) {
        const current = await redisClient.incr(key);
        if (current === 1) {
          await redisClient.expire(key, windowSeconds);
        }

        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, max - current));

        if (current > max) {
          const ttl = await redisClient.ttl(key);
          res.setHeader("Retry-After", ttl > 0 ? ttl : windowSeconds);
          return next(new ApiError(429, message));
        }

        return next();
      }
    } catch (err) {
      // Redis error fallback to in-memory store
      console.warn("Redis rate limiter unavailable, falling back to memory:", err);
    }

    // In-memory fallback
    const now = Date.now();
    let entry = memoryStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      memoryStore.set(key, entry);
    } else {
      entry.count += 1;
    }

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - entry.count));

    if (entry.count > max) {
      const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return next(new ApiError(429, message));
    }

    next();
  };
};

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many authentication attempts. Please try again after 15 minutes.",
  keyPrefix: "rl:auth",
});
