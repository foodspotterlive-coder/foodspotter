'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
        }

        static async hashPassword(password) {
            return await bcrypt.hash(password, 10);
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
