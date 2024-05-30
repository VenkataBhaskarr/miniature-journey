const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Register User
router.post('/signup', async (req, res) => {
    const { name, email, password, gender } = req.body;
    try {
        const user = new User({ name, email, password, gender });
        await user.save();
        const token = jwt.sign({ email, role: 'user' }, "secret", { expiresIn: '1h' });
        res.status(201).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Login User/Admin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    let isAdmin = false;
    if (email === 'admin@email.com' && password === "Admin@123") {
        isAdmin = true;
    }
    try {
        const model = isAdmin ? Admin : User;
        const user = await model.findOne({ email, password });
        if(isAdmin === true){
            console.log(user)
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email, role: isAdmin ? 'admin' : 'user' }, "secret", { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get User/Admin Data
router.get('/user', authMiddleware, async (req, res) => {
    if(req.user.email === 'admin@email.com'){
        req.user.role = 'admin';
    }else{
        req.user.role = 'user';
    }
    try {
        const model = req.user.role === 'admin' ? Admin : User;
        const user = await model.findOne({ email: req.user.email });
        res.status(200).json({ success: true, user, role: req.user.role });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get All Users (Admin Only)
router.get('/users', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    try {
        const users = await User.find({});
        console.log(users)
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;

