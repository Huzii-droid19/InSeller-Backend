"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Orders, {
        foreignKey: "order_id",
        as: "order",
        onDelete: "cascade",
        hooks: true,
      });
      OrderItem.belongsTo(models.Item, {
        foreignKey: "item_id",
        as: "item",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  OrderItem.init(
    {
      item_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  return OrderItem;
};
