'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            Admin.hasMany(models.Review, { foreignKey: 'adminId', as: 'reviews' });
        }

        static async hashPassword(password) {
            return await bcrypt.hash(password, 10);
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
    Admin.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'admin'
        }
    }, {
        sequelize,
        modelName: 'Admin',
    });
    return Admin;
};
