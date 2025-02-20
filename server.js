const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Load users from JSON file
let users = [];
try {
    users = JSON.parse(fs.readFileSync('users.json'));
} catch (err) {
    console.log('No existing users found, starting with empty user list');
}

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Register new user
app.post('/register', async (req, res) => {
    const { email } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Save user
    users.push({ email });
    fs.writeFileSync('users.json', JSON.stringify(users));
    
    res.json({ message: 'User registered successfully' });
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { email } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('Invalid email format:', email);
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Find user - support both old {email} object and new string format
    const user = users.find(user => {
        if (typeof user === 'object') {
            return user.email === email;
        }
        return user === email;
    });
    if (!user) {
        console.error('User not found:', email);
        return res.status(404).json({ error: 'No account found with this email address' });
    }


    // Successful login
    
    res.json({ message: 'Login successful' });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the server at http://localhost:${PORT}`);
});
