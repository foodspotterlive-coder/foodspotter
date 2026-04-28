const express = require('express');
const { addReview, getRestaurantReviews } = require('../Controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:restaurantId', getRestaurantReviews);

// Protected routes (require valid JWT)
router.post('/', protect, addReview);

module.exports = router;
