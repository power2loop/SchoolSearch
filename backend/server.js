require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'schoolImages');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

app.use("/schoolImages", express.static(path.join(__dirname, "schoolImages")));

app.post("/api/schools", upload.single("image"), async (req, res) => {
    try {
        const { name, address, city, state, contact, email_id } = req.body;
        const image = req.file.filename;

        await db.query(
            "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, address, city, state, contact, email_id, image]
        );

        res.json({ message: "School added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get('/api/schools', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
