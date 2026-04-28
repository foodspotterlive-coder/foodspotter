const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Path to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
    }
});

// Create Multer instance
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Max 5MB file size
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only images (JPG, PNG, WebP) are allowed!');
        }
    }
});

// POST endpoint for image uploading
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    // Construct the full image URL. Assume server runs on 3000
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
        success: true,
        message: 'Image uploaded successfully!',
        imageUrl: imageUrl
    });
});

module.exports = router;
