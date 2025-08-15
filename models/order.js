'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: 'orderId'
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