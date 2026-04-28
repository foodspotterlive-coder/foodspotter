const express = require('express');
const { getAllRestaurants, createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant, getLocations } = require('../Controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/locations', getLocations);
router.get('/:id', getRestaurantById);

// Protected routes (require valid JWT)
router.post('/', protect, createRestaurant);
router.put('/:id', protect, updateRestaurant);
router.delete('/:id', protect, deleteRestaurant);

module.exports = router;