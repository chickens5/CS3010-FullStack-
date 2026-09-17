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
        'INSERT INTO user_account_details (user_id, email, profile_picture) VALUES ($1, NULL, NULL)',
        [userId]
    );
}
/* GET ACCOUNT BY ID */
export async function findAccountById(id) {
    const result = await pool.query(
        `SELECT ua.id, ua.username, 
                COALESCE(uad.email, '') AS email, 
                COALESCE(uad.created_at, NOW()) AS created_at, 
                COALESCE(uad.profile_picture, '/default-profile.png') AS profile_picture 
        FROM user_accounts ua 
        LEFT JOIN user_account_details uad ON ua.id = uad.user_id 
        WHERE ua.id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

/* UPDATES OR INSERTS ACCOUNT DETAILS */
export async function updateUserID(req, res)  {
    let id = req.params.id;
    const { email, profile_picture } = req.body; // Fields to update

    console.log('Updating account for id:', id);

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        //  Check if the user has an entry in user_account_details
        const userDetailsCheck = await pool.query(
            'SELECT * FROM user_account_details WHERE user_id = $1',
            [parseInt(id)]
        );

        if (userDetailsCheck.rows.length === 0) {
            //  No record found, INSERT new entry
            console.log('🟡 No user details found. Creating new entry...');

            const insertQuery = `
                INSERT INTO user_account_details (user_id, email, profile_picture)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

            const insertResult = await pool.query(insertQuery, [
                parseInt(id),
                email || null,
                profile_picture || null
            ]);

            console.log('++ ~  New Account Details Created:', insertResult.rows[0]);
            return res.status(201).json({ message: 'Account details created successfully!', account: insertResult.rows[0] });
        } else {
            //  Else, Record exists and UPDATE it
            console.log('++ ~ Updating existing account details...');

            const updateQuery = `
                UPDATE user_account_details 
                SET email = COALESCE($1, email), 
                    profile_picture = COALESCE($2, profile_picture) 
                WHERE user_id = $3 
                RETURNING *;
            `;

            const updateResult = await pool.query(updateQuery, [
                email || null,
                profile_picture || null,
                parseInt(id)
            ]);

            console.log('++ ~ Account Updated:', updateResult.rows[0]);
            return res.status(200).json({ message: 'Account updated successfully!', account: updateResult.rows[0] });
        }
    } catch (error) {
        console.error('XX ~ Error updating account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/*  LOGOUT USER */
export async function logoutUser(req, res)  {
    res.status(200).json({ message: 'Logged out successfully!' });
}

