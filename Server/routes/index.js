const express = require('express');
const router = express.Router();
const restaurantRoutes=require('./restaurantRoutes');
const adminRoutes = require('./adminRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/restaurants', restaurantRoutes);
router.use('/admins', adminRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;