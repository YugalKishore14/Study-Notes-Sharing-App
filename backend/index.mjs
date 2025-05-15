import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import upload from './utils/storage.js';  // multer cloudinary storage

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup
app.use(cors({
    origin: ['http://localhost:5173', 'https://study-notes-sharing-app-frontend.onrender.com'],
    credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Upload folder ensure (optional if you use Cloudinary only)
const uploadFolder = path.join(__dirname, 'upload/images');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Static serve uploaded images (optional, not used with Cloudinary)
app.use('/images', express.static(uploadFolder));

// Mongo Schemas
const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.model('Counter', counterSchema);

const notesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: String,
    subject: String,
    file_url: String,    // Cloudinary URL (image or pdf)
    file_type: String,   // 'image' or 'pdf'
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    date: { type: Date, default: Date.now },
});
const Notes = mongoose.model('Notes', notesSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['teacher', 'student'], default: 'student' },
    date: { type: Date, default: Date.now },
});
const Users = mongoose.model('Users', userSchema);

// Routes

app.get('/api', (req, res) => res.send('API is running...'));

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const check = await Users.findOne({ email });
        if (check) return res.status(400).json({ success: false, errors: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({ name, email, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Signup failed' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) return res.json({ success: false, errors: 'Wrong Email Id' });

        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passCompare) return res.json({ success: false, errors: 'Wrong Password' });

        const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Upload Image or PDF (Cloudinary)
app.post('/api/upload', upload.single('notes'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, image_url: req.file.path });  // Cloudinary URL return karta hai
});

// Add Notes
app.post('/api/addnotes', async (req, res) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'notes_id' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newNote = new Notes({
            id: counter.seq,
            title: req.body.title,
            subject: req.body.subject,
            file_url: req.body.file_url,
            file_type: req.body.file_type,
            uploadedBy: req.body.uploadedBy
        });
        await newNote.save();
        res.json({ success: true, message: 'Note added successfully' });
    } catch (error) {
        console.error('Add notes Error:', error);
        res.status(500).json({ success: false, message: 'Error adding note' });
    }
});

// Remove Notes
app.post('/api/removenotes', async (req, res) => {
    try {
        await Notes.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, message: 'Note removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing note' });
    }
});

// Get All Notes
app.get('/api/allnotes', async (req, res) => {
    try {
        const notes = await Notes.find({});
        res.json(notes);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
});

// Get New Notes
app.get('/api/newnotes', async (req, res) => {
    try {
        const notes = await Notes.find({}).sort({ date: -1 }).limit(8);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching new notes' });
    }
});

// Download Notes (redirect to Cloudinary URL)
app.get('/api/download/:id', async (req, res) => {
    try {
        const note = await Notes.findOne({ id: req.params.id });
        if (!note || !note.file_url) return res.status(404).json({ success: false, message: 'Note not found' });
        res.redirect(note.file_url);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: 'Error downloading file' });
    }
});

// Serve frontend build (if exists)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});