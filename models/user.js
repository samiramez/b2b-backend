'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
  User.hasMany(models.Order, { foreignKey: 'userId' });
}
  }
  User.init({
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'customer', 'supplier'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

// User.associate = (models) => {
//   User.hasMany(models.Order, { foreignKey: 'userId' });
// };
