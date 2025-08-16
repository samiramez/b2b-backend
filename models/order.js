'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {

    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: 'orderId',
        otherKey: 'productId',
        as: 'products'
      });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    totalAmount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};