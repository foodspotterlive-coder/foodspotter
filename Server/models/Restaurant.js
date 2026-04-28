'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Restaurant extends Model {
        static associate(models) {
            Restaurant.hasMany(models.Review, { foreignKey: 'restaurantId', as: 'reviews' });
        }
    }
    Restaurant.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: false
        },
        famousRecipe: {
            type: DataTypes.STRING,
            allowNull: false
        },
        averagePrice: {
            type: DataTypes.FLOAT,
            allowNull: false

        },
        operatingDays: {
            type: DataTypes.STRING,
            allowNull: false
        },
        operatingHours: {
            type: DataTypes.JSON, // Storing as JSON object
            allowNull: true
        },
        paymentTypes: {
            type: DataTypes.JSON, // MySQL supports JSON, or use STRING and split
            allowNull: false
        },
        location: {
            type: DataTypes.GEOMETRY('POINT'),
            allowNull: true
        },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: { 
                min: 0,
                max: 5
            }
        },
        time:{
            type:DataTypes.TIME,
            allowNull:true
        },
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Restaurant',
    });
    return Restaurant;
};  
