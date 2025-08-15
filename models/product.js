'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: 'productId'
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};

// Product.associate = (models) => {
//   Product.belongsToMany(models.Order, { through: models.OrderItem, foreignKey: 'productId' });
// };
