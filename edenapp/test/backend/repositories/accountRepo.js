// PostgreSQL query repository for AccountDetails ~ GJ 9/16/26 1300
import pool from '../services/db.js'

/* REGISTER + LOGIN  */
export async function findUserByUsername(username) {
    const result = await pool.query(
        'SELECT * FROM user_accounts WHERE username = $1',
        [username]
    );
    return result.rows[0] || null;
}

export async function insertUser(username, hashedPassword) {
    const result = await pool.query(
        'INSERT INTO user_accounts (username, password) VALUES ($1, $2) RETURNING id',
        [username, hashedPassword]
    );
    return result.rows[0].id;
}

export async function insertUserDetails(userId) {
    await pool.query(
        'INSERT INTO user_account_details (user_id, firstname, lastname, bio, email, profile_picture) VALUES ($1, NULL, NULL, NULL, NULL, NULL)',
        [userId]
    );
}
/* GET ACCOUNT BY ID */
export async function findAccountById(id) {
    const result = await pool.query(
        `SELECT ua.id, ua.username, 
                COALESCE(uad.email, '') AS email, 
                COALESCE(uad.firstname, '') AS firstname,
                COALESCE(uad.lastname, '') AS lastname,
                COALESCE(uad.bio, '') AS bio,
                COALESCE(uad.created_at, NOW()) AS created_at, 
                COALESCE(uad.profile_picture, '/default-profile.png') AS profile_picture 
        FROM user_accounts ua 
        LEFT JOIN user_account_details uad ON ua.id = uad.user_id 
        WHERE ua.id = $1`,
        [id]
    );
    return result.rows[0] || null;
}


// Updates Account details if id matches
export async function upsertAccountDetails(id, { email, firstname, lastname, bio, profile_picture } = {}) {
    const userDetailsCheck = await pool.query(
        'SELECT * FROM user_account_details WHERE user_id = $1',
        [id]
    );

    if (userDetailsCheck.rows.length === 0) {
        const insertResult = await pool.query(
            `INSERT INTO user_account_details (user_id, email, firstname, lastname, bio, profile_picture)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [id, email || null, firstname || null, lastname || null, bio || null, profile_picture || null]
        );
        return insertResult.rows[0];
    }

    const updateResult = await pool.query(
        `UPDATE user_account_details
         SET email = COALESCE($1, email),
             firstname = COALESCE($2, firstname),
             lastname = COALESCE($3, lastname),
             bio = COALESCE($4, bio),
             profile_picture = COALESCE($5, profile_picture)
         WHERE user_id = $6
         RETURNING *`,
        [email || null, firstname || null, lastname || null, bio || null, profile_picture || null, id]
    );
    return updateResult.rows[0];
}


