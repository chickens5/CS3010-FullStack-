//PostgreSQL Pool + Connection ~ GJ 9/16/26 1300
import dotenv from 'dotenv'
import pkg from "pg";

dotenv.config()

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
});

export default pool;