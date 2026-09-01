import path from "path"
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pkg from "pg"; // PostgreSQL Client
import multer from "multer";
import fs from "fs";
import dotenv from 'dotenv'

//Configures env vars
dotenv.config()

const { Pool } = pkg;
const app = express();
const PORT = 5000;

//PostgreSQL Connection
const pool = new Pool({
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
});
const JWT_SECRET = process.env.JWPW;

app.use(express.json());
app.use(cors());

/*Starts Server */
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});


const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//Configures Multer Storage
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix); //Store filename as unique timestamp
    },
});

// const upload = multer({ storage });

// // Fix __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "dist")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "dist", "index.html"));
//     });
// }



//---------  REGISTER + LOGIN (POST)  --------------------------

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const existingUser = await pool.query(
            "SELECT * FROM user_accounts WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "Username already taken." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO user_accounts (username, password) VALUES ($1, $2) RETURNING id",
            [username, hashedPassword]
        );

        const user_id = newUser.rows[0].id;

        // Creates default empty profile details
        await pool.query(
            "INSERT INTO user_account_details (user_id, email, profile_picture) VALUES ($1, NULL, NULL)",
            [user_id]
        );

        // Generates JWT token
        const access_token = jwt.sign({ user_id, username }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "User registered successfully!",
            user_id,
            username,
            access_token,
        });

    } catch (error) {
        console.error("XX ~ Registration error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Success creating account!")
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM user_accounts WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(400).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Incorrect password" });

        const token = jwt.sign({ user_id: user.rows[0].id, username: user.rows[0].username }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful!", access_token: token, user_id: user.rows[0].id });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ---------  ACCOUNT MANAGEMENT (GET/PUT) -------------

app.get("/api/account/:id", async (req, res) => {
    let id = req.params.id;

    console.log("++ ~ Fetching account for id:", id);

    //Ensures id is a valid integer
    if (!id || isNaN(id)) {
        console.log("XX ~ Invalid id received:", id);
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const result = await pool.query(
            `SELECT ua.id, ua.username, 
                    COALESCE(uad.email, '') AS email, 
                    COALESCE(uad.created_at, NOW()) AS created_at, 
                    COALESCE(uad.profile_picture, '/default-profile.png') AS profile_picture 
            FROM user_accounts ua 
            LEFT JOIN user_account_details uad ON ua.id = uad.user_id 
            WHERE ua.id = $1`,
            [parseInt(id)]
        );

        if (result.rows.length === 0) {
            console.log("XX ~ No user found in DB for id:", id);
            return res.status(404).json({ error: "User account not found" });
        }

        console.log("++ ~ Account Data Found:", result.rows[0]);
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching account details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/* UPDATES OR INSERTS ACCOUNT DETAILS */
app.put("/api/account/:id", async (req, res) => {
    let id = req.params.id;
    const { email, profile_picture } = req.body; // Fields to update

    console.log("Updating account for id:", id);

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        //  Check if the user has an entry in user_account_details
        const userDetailsCheck = await pool.query(
            "SELECT * FROM user_account_details WHERE user_id = $1",
            [parseInt(id)]
        );

        if (userDetailsCheck.rows.length === 0) {
            // 🔹 No record found, INSERT new entry
            console.log("🟡 No user details found. Creating new entry...");

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

            console.log("++ ~  New Account Details Created:", insertResult.rows[0]);
            return res.status(201).json({ message: "Account details created successfully!", account: insertResult.rows[0] });
        } else {
            //  Else, Record exists and UPDATE it
            console.log("++ ~ Updating existing account details...");

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

            console.log("++ ~ Account Updated:", updateResult.rows[0]);
            return res.status(200).json({ message: "Account updated successfully!", account: updateResult.rows[0] });
        }
    } catch (error) {
        console.error("XX ~ Error updating account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/*  LOGOUT USER */
app.post("/api/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully!" });
});


