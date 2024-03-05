import pg from "pg";
import dotenv from "dotenv";

dotenv.config()

const db = new pg.Client({
    database: process.env.DB_NAME,
    host: "localhost",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

db.connect((err) => {
    if (err) throw err;
})

export default db

