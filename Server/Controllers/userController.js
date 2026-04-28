const { User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '6b45d7c55c23e6332b19ab313583a1ef573c11a5efe4bf3f6064f20459570bfb58e03a45994bc0ad80ba71e098a5975d0155a8b1a1b4ad4a8533a9ca1613c01a';

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Already exists check
        const existing = await User.findOne({ where: { [require('sequelize').Op.or]: [{ username }, { email }] } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username or email already in use' });
        }

        const hashedPassword = await User.hashPassword(password);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // Can be username or email

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};
