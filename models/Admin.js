// models/Admin.js
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
