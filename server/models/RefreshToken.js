import { pool } from "../db.js";

export const RefreshTokenModel = {
    async create({ user_id, token_hash, user_agent, ip_address, expires_at }) {
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, user_agent, ip_address, expires_at)
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, token_hash, user_agent ?? null, ip_address ?? null, expires_at]
        );
    },

    // Only a token that hasn't been revoked and hasn't expired counts as valid —
    // both conditions checked in SQL rather than trusting the JWT's own `exp`.
    async findValidByHash(token_hash) {
        const [rows] = await pool.query(
          `SELECT * FROM refresh_tokens
           WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()
           LIMIT 1`,
          [token_hash]
        );
        return rows[0] ?? null;
    },

    async revoke(id) {
        await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?', [id]);
    },

    async revokeByHash(token_hash) {
        await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [token_hash]);
    },

    // Nuclear option, used when we detect a refresh token being reused after
    // rotation — the likely explanation is theft, so every session for this
    // user is killed and they have to log in again everywhere.
    async revokeAllForUser(user_id) {
        await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [user_id]);
    },
};