require('dotenv').config();
const MONGODB_KEY = process.env.MONGODB_KEY;

// index.js
const express = require('express');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');

// Create Express app
const app = express();
const CORS = require("cors")
app.use(CORS())
// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


