const { Review, Restaurant, Admin, User } = require('../models');

module.exports.addReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment } = req.body;
        const { id, role } = req.user; // From authMiddleware

        // Check if restaurant exists
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        const review = await Review.create({
            adminId: role === 'admin' ? id : null,
            userId: role === 'user' ? id : null,
            restaurantId,
            rating,
            comment
        });

        // Update average rating for restaurant
        const reviews = await Review.findAll({ where: { restaurantId } });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await restaurant.update({ rating: parseFloat(avgRating.toFixed(1)) });

        const reviewWithAuthor = await Review.findByPk(review.id, {
            include: [
                { model: Admin, as: 'admin', attributes: ['username'] },
                { model: User, as: 'user', attributes: ['username'] }
            ]
        });

        res.status(201).json({
            success: true,
            data: reviewWithAuthor
        });
    } catch (err) {
        console.error('Error in addReview:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

module.exports.getRestaurantReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { restaurantId: req.params.restaurantId },
            include: [
                { model: Admin, as: 'admin', attributes: ['username'] },
                { model: User, as: 'user', attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (err) {
        console.error('Error in getRestaurantReviews:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};
