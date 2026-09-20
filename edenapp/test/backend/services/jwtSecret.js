// JWT signing key shared by accountService (sign) and server.js (verify).
import crypto from 'crypto';

// Returns random secret if env is not set.
function getJWT() {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }
    console.warn('JWT_SECRET not set - using a random in-memory secret for this run.');
    return crypto.randomBytes(64).toString('hex');
}

export const JWT_SECRET = getJWT();
