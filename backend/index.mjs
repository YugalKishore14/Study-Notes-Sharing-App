require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
// const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fileURLToPath } = require("url");
// Required if using ES modules

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


// Serve static files from Vite build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
    .connect(process.env.DATABASE_URL, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Ensure Upload Folder Exists
const uploadFolder = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}


// Multer Storage Config
const storage = multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage });


// Serve uploaded images statically
app.use("/images", express.static(uploadFolder));


// Auto-increment Counter Schema
const counterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);


// Notes Schema
const notesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    image: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    date: { type: Date, default: Date.now },
});
const Notes = mongoose.model("Notes", notesSchema);


///////////////////////////////////////////////////
// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["teacher", "student"], default: "student" },
    date: { type: Date, default: Date.now },
});
const Users = mongoose.model("Users", userSchema);
///////////////////////////////////////////////////


// Routes
app.get("/", (req, res) => res.send("Study Notes Sharing App Running"));


///////////////////////////////////////////////
// Signup
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let check = await Users.findOne({ email });
        if (check) {
            return res.status(400).json({
                success: false,
                errors: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Users({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        const data = {
            user: { id: user._id, role: user.role }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);

        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Signup failed" });
    }
});


// Login
app.post("/login", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ success: false, errors: "Wrong Email Id" });
        }

        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passCompare) {
            return res.json({ success: false, errors: "Wrong Password" });
        }

        const data = {
            user: { id: user._id, role: user.role }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);
        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

////////////////////////////////////////////////////////////////


// Upload Notes by Teacher
app.post("/upload", upload.single("notes"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    res.json({ success: true, image_url: imageUrl });
});


// Add Notes
app.post("/addnotes", async (req, res) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "notes_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const newNote = new Notes({
            id: counter.seq,
            ...req.body,
        });
        await newNote.save();
        res.json({ success: true, message: "Note added successfully" });
    } catch (error) {
        console.error("Add notes Error:", error);
        res.status(500).json({ success: false, message: "Error adding note" });
    }
});


// Remove Notes
app.post("/removenotes", async (req, res) => {
    try {
        await Notes.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, message: "Note removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error removing note" });
    }
});


// Get All Notes
app.get("/allnotes", async (req, res) => {
    try {
        const notes = await Notes.find({});
        res.json(notes);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching notes" });
    }
});


// Download Notes File
app.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadFolder, filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename);
    } else {
        res.status(404).json({ success: false, message: "File not found" });
    }
});


// Get Latest Notes
app.get("/newnotes", async (req, res) => {
    try {
        let notes = await Notes.find({}).sort({ date: -1 }).limit(8);
        res.send(notes);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching new notes" });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
