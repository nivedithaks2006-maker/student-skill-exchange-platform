const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    branch: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    skillsOffered: {
        type: [String],
        default: []
    },

    skillsWanted: {
        type: [String],
        default: []
    },

    role: {
        type: String,
        default: "student"
    }
});

module.exports = mongoose.model("User", userSchema);