"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
        onDelete: "cascade",
        hooks: true,
      });
      Orders.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });
    }
  }
  Orders.init(
    {
      order_no: DataTypes.STRING,
      payment: DataTypes.JSON,
      amount: DataTypes.FLOAT,
      customer_details: DataTypes.JSON,
      status: DataTypes.ENUM("Pending", "Accepted", "Cancelled", "Delivered"),
      store_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Orders",
    }
  );
  return Orders;
};
