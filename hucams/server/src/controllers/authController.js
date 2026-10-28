const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Mock Database Check (Replace with Prisma query later)
        let user = null;

        if (email === 'admin@hucams.com' && password === 'admin123') {
            user = { id: 1, name: 'Admin User', email, role: 'ADMIN' };
        } else if (email === 'student@hucams.com' && password === 'student123') {
            user = { id: 2, name: 'Student User', email, role: 'STUDENT' };
        } else if (email === 'warden@hucams.com' && password === 'warden123') {
            user = { id: 3, name: 'Warden User', email, role: 'WARDEN' };
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        // Using a fallback secret if process.env.JWT_SECRET is missing for dev stability
        const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
        const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.register = async (req, res) => {
    // TODO: Implement register logic
    res.json({ message: 'Register endpoint' });
};

exports.logout = async (req, res) => {
    // For JWT, the client handles logout by removing the token.
    // However, we can use this endpoint for logging, cookie clearing (if cookies used), or blacklist (if implemented).
    res.json({ message: 'Logged out' });
};
