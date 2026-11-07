require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Student = require("./api/student");
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
const { promisify } = require('util');
const { randomBytes, scrypt: scryptCallback } = require('crypto');
const Port = process.env.PORT || 5000;
const scrypt = promisify(scryptCallback);

dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {console.log("MongoDB connected");})
    .catch((err) => console.error("MongoDB connection error", err));

app.get('/', (req, res) => {
  res.send("Student Management System API is running");
});

app.post("/Student", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                message: "A registration object is required"
            });
        }

        const { sName, sId, email, role = "student", username, password } = req.body;

        if (![sName, sId, email, username, password].every(
            (value) => typeof value === "string" && value.trim()
        )) {
            return res.status(400).json({
                message: "Name, ID, email, username, and password are required"
            });
        }

        if (!["student", "lecturer"].includes(role)) {
            return res.status(400).json({
                message: "Role must be student or lecturer"
            });
        }

        if (sName.trim().length < 2) {
            return res.status(400).json({ message: "Enter your full name" });
        }

        if (!/^[A-Za-z]\d{3,8}$/.test(sId.trim())) {
            return res.status(400).json({
                message: "ID must be a letter followed by 3–8 digits"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ message: "Enter a valid email address" });
        }

        if (!/^[A-Za-z0-9._-]{4,20}$/.test(username.trim())) {
            return res.status(400).json({
                message: "Username must be 4–20 letters, numbers, dots, or dashes"
            });
        }

        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must have 8 or more characters, including letters and numbers"
            });
        }

        const salt = randomBytes(16).toString("hex");
        const passwordHash = (await scrypt(password, salt, 64)).toString("hex");
        const student = await Student.create({
            sName: sName.trim(),
            sId: sId.trim(),
            email: email.trim(),
            role,
            username: username.trim(),
            passwordHash: `${salt}:${passwordHash}`
        });

        return res.status(201).json({
            message: `${role === "student" ? "Student" : "Lecturer"} registered successfully`,
            registration: {
                id: student._id,
                sName: student.sName,
                sId: student.sId,
                email: student.email,
                role: student.role,
                username: student.username
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];
            return res.status(409).json({
                message: duplicateField === "username"
                    ? "Username already exists"
                    : "Student or staff ID already exists"
            });
        }

        console.error("Registration failed", error);
        return res.status(500).json({
            message: "Registration failed"
        });
    }
});

app.get("/Student", async (req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({
            message: "Could not retrieve students"
        });
    }
});

app.get("/Student/:sId", async (req, res) => {
    try {
        const student = await Student.findOne({ sId: req.params.sId });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json({ student });
    } catch (error) {
        return res.status(500).json({
            message: "Could not retrieve student"
        });
    }
});

app.put("/Student/:sId", async (req, res) => {
    const allowedFields = ["sName", "sId", "email"];
    const fields = req.body && typeof req.body === "object" && !Array.isArray(req.body)
        ? Object.keys(req.body)
        : [];

    if (fields.length === 0 || fields.some((field) => !allowedFields.includes(field))) {
        return res.status(400).json({
            message: "Provide one or more valid student fields to update"
        });
    }

    if (fields.some((field) => typeof req.body[field] !== "string" || !req.body[field].trim())) {
        return res.status(400).json({
            message: "Student fields must be non-empty strings"
        });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { sId: req.params.sId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.status(200).json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student ID already exists"
            });
        }

        return res.status(500).json({
            message: "Student update failed"
        });
    }
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});