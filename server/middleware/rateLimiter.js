// import rateLimit from 'express-rate-limit';

// // Brute-force protection on login specifically — 10 attempts per 15 minutes
// // per IP. Keyed by IP + email would be tighter (stops one IP from locking out
// // many accounts) but needs a custom store; this is the safe default.
// export const loginRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: 'Too many login attempts. Please try again in 15 minutes.',
//     code: 'AUTH_RATE_LIMITED',
//   },
// });
