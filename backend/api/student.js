const mongoose = require("mongoose");

const std = new mongoose.Schema({
    sName:{
        type: String,
        required: true
    },
    sId:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Student', std);