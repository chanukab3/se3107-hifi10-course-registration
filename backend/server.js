require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Student = require("./api/student");
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
const Port = process.env.PORT || 5000;

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
                message: "A student object is required"
            });
        }

        const { sName, sId, email } = req.body;

        if (![sName, sId, email].every((value) => typeof value === "string" && value.trim())) {
            return res.status(400).json({
                message: "Name, student ID, and email are required"
            });
        }

        const student = await Student.create({
            sName,
            sId,
            email
        });

        res.status(201).json({
            message: "Student registered successfully",
            student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student ID already exists"
            });
        }

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