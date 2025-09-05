require('dotenv').config();

console.log('Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

const mysql = require("mysql2/promise");

async function testDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });

        console.log("✅ Connected to FreeSQLDatabase!");

        // Check if data exists
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM schools");
        console.log(`📊 Current schools in FreeSQLDatabase: ${rows[0].count}`);

        await connection.end();
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}

testDB();
