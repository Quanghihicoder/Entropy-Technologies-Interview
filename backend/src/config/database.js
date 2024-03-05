import pg from "pg";
import dotenv from "dotenv";

dotenv.config()

const db = new pg.Client({
    database: "entropy",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.DB_PASS
})

db.connect((err) => {
    if (err) throw err;
})

export default db

