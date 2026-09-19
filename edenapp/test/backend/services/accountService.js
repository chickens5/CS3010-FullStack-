// accountService.js ~ ~ GJ 9/19/26 1800 

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, insertUser, insertUserDetails, findAccountById, upsertAccountDetails } from '../repositories/accountRepo.js';
import { JWT_SECRET } from './jwtSecret.js';

// Returns HTTP status/message 
function httpError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// Register & Login User
export async function registerUser({ username, password }) {
    if (!username || !password) {
        throw httpError(400, "All fields are required!");
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        throw httpError(409, "Username already taken.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = await insertUser(username, hashedPassword);
    await insertUserDetails(user_id);

    const access_token = jwt.sign({ user_id, username }, JWT_SECRET, { expiresIn: "1h" });

    return {
        message: "User registered successfully!",
        user_id,
        username,
        access_token,
    };
}

export async function loginUser({ username, password }) {
    const user = await findUserByUsername(username);
    if (!user) {
        throw httpError(400, "User not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw httpError(401, "Incorrect password");
    }

    const access_token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });

    return { message: "Login successful!", access_token, user_id: user.id, username: user.username };
}


// Get Account by ID
export async function getAccount(id) {
    if (!id || isNaN(id)) {
        throw httpError(400, "Invalid user ID");
    }

    const account = await findAccountById(parseInt(id));
    if (!account) {
        throw httpError(404, "User account not found");
    }

    return account;
}

// Updates account details 
export async function updateAccount(id, { email, profile_picture } = {}) {
    if (!id || isNaN(id)) {
        throw httpError(400, "Invalid user ID");
    }
    const account = await upsertAccountDetails(parseInt(id), { email, profile_picture });
    if (!account) {
        throw httpError(404, "User account not found");
    }
    return account;
}
