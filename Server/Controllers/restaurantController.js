const { Restaurant, Sequelize } = require('../models');
const { Op } = Sequelize;

module.exports.getAllRestaurants = async (req, res) => {
    try {
        const { search, location } = req.query;
        console.log(`Searching with query - Search: ${search}, Location: ${location}`);

        let whereClause = {};
        const andConditions = [];

        if (search && search.trim() !== '') {
            andConditions.push({
                [Op.or]: [
                    { name: { [Op.like]: `%${search.trim()}%` } },
                    { famousRecipe: { [Op.like]: `%${search.trim()}%` } }
                ]
            });
        }

        if (location && location.trim() !== '') {
            andConditions.push({
                [Op.or]: [
                    { place: { [Op.like]: `%${location.trim()}%` } },
                    { landmark: { [Op.like]: `%${location.trim()}%` } }
                ]
            });
        }

        if (andConditions.length > 0) {
            whereClause = { [Op.and]: andConditions };
        }

        const restaurants = await Restaurant.findAll({
            where: whereClause
        });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (err) {
        console.error('Error in getAllRestaurants:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};
 

module.exports.createRestaurant = async (req, res) => {
    try {
        const {
            name, place, landmark, famousRecipe, averagePrice,
            operatingDays, operatingHours, paymentTypes, location,
            imageUrl, rating, time, videoUrl
        } = req.body;

        const newRestaurant = await Restaurant.create({
            name,
            place,
            landmark,
            famousRecipe,
            averagePrice,
            operatingDays,
            operatingHours,
            paymentTypes,
            location,
            imageUrl,
            rating,
            time,
            videoUrl
        });

        res.status(201).json({
            success: true,
            data: newRestaurant
        });
    } catch (err) {
        console.error('Error in createRestaurant:', err);
        if (err.name === 'SequelizeValidationError') {
            const messages = err.errors.map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        }); 
    }
};


module.exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: `Restaurant not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        console.error('Error in getRestaurantById:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};
    


module.exports.updateRestaurant = async (req, res) => { 
    try {
        let restaurant = await Restaurant.findByPk(req.params.id);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: `Restaurant not found with id of ${req.params.id}`
            });
        }

        restaurant = await restaurant.update(req.body);

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        console.error('Error in updateRestaurant:', err);
        if (err.name === 'SequelizeValidationError') {
            const messages = err.errors.map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};


module.exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id);
         
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: `Restaurant not found with id of ${req.params.id}`
            });
        }
        await restaurant.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Error in deleteRestaurant:', err);
        res.status(500).json({                                                                   
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

module.exports.getLocations = async (req, res) => {
    try {
        const { query } = req.query;
        
        let whereClause = {};
        if (query) {
            whereClause = {
                [Op.or]: [
                    { place: { [Op.like]: `%${query}%` } },
                    { landmark: { [Op.like]: `%${query}%` } }
                ]
            };
        }

        const locations = await Restaurant.findAll({
            attributes: ['place'],
            where: whereClause,
            group: ['place'],
            limit: 5
        });

        const suggestions = locations.map(l => l.place);

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (err) {
        console.error('Error in getLocations:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
