const mongoose = require("mongoose");

const std = new mongoose.Schema({
    sName: {
        type: String,
        required: true,
        trim: true
    },
    sId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ["student", "lecturer"],
        default: "student",
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    }
});

module.exports = mongoose.model('Student', std);