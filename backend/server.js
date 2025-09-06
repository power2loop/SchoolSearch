import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import supabase from './supabaseClient.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const UPLOAD_DIR = path.join(__dirname, 'tmpUploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });


app.use("/schoolImages", express.static(path.join(__dirname, "schoolImages")));

app.post("/api/schools", upload.single("image"), async (req, res) => {
    try {
        const { name, address, city, state, contact, email_id } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        const fileBuffer = fs.readFileSync(req.file.path);
        const ext = path.extname(req.file.originalname);
        const filename = `${Date.now()}${ext}`;
        const bucket = 'school-images';
        const filePathInBucket = filename;


        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePathInBucket, fileBuffer, { contentType: req.file.mimetype });

        if (uploadError) {
            throw uploadError;
        }

        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePathInBucket);
        const imageUrl = publicData?.publicUrl || null;

        const { data: inserted, error: insertError } = await supabase
            .from('schools')
            .insert([{ name, address, city, state, contact, email_id, image: imageUrl }])
            .select();

        fs.unlinkSync(req.file.path);

        if (insertError) throw insertError;

        res.json({ message: "School added successfully", school: inserted[0] });
    } catch (err) {
        console.error("POST /api/schools error:", err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Database or Storage error", details: err.message });
    }
});

app.get('/api/schools', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('schools')
            .select('id, name, address, city, image')
            .order('id', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("GET /api/schools error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
