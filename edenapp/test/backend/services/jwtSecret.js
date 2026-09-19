// Single source of truth for the JWT signing key, shared by accountService (sign) and server.js (verify).
import crypto from 'crypto';

function resolveJwtSecret() {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }
    // No explicit secret configured: use a random per-process secret so nothing ships with a guessable default.
    // Existing tokens are invalidated on every restart - set JWT_SECRET in .env for production so sessions persist.
    console.warn('JWT_SECRET not set - using a random in-memory secret for this run.');
    return crypto.randomBytes(64).toString('hex');
}

export const JWT_SECRET = resolveJwtSecret();
