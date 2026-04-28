const { Admin } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '6b45d7c55c23e6332b19ab313583a1ef573c11a5efe4bf3f6064f20459570bfb58e03a45994bc0ad80ba71e098a5975d0155a8b1a1b4ad4a8533a9ca1613c01a';

// @desc Login user 
module.exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Username or password'
            });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Username or Password'
            });
        }

        const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Error in loginUser:', err);          
        res.status(500).json({
            success: false, 
            message: 'Server Error',
            error: err.message
        });
    } 
};

// @desc Create initial admin (only for development/setup)
module.exports.setupAdmin = async (req, res) => {
    try {
        const { username, password } = req.body; 

        const adminCount = await Admin.count();
        if (adminCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        const hashedPassword = await Admin.hashPassword(password);
        const admin = await Admin.create({
            username,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (err) {
        console.error('Error in setupAdmin:', err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};
