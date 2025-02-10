require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();

// Basic Authentication middleware
const auth = basicAuth({
    users: { [process.env.USERNAME]: process.env.PASSWORD },
    challenge: true,
    realm: 'Secret Area'
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Hello, world!',
        timestamp: new Date().toISOString()
    });
});

// Protected secret route
app.get('/secret', auth, (req, res) => {
    res.json({
        message: process.env.SECRET_MESSAGE,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
