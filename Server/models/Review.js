'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.Admin, { foreignKey: 'adminId', as: 'admin' });
            Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Review.belongsTo(models.Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
        }
    }
    Review.init({
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Admins',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Restaurants',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Review',
    });
    return Review;
};
