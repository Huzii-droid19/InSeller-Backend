"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.ItemCategory, {
        foreignKey: "category_id",
        as: "category",
        onDelete: "cascade",
        hooks: true,
      });
      Item.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
        onDelete: "cascade",
        hooks: true,
      });
      Item.hasMany(models.ItemImage, {
        foreignKey: "item_id",
        as: "images",
      });
      Item.hasMany(models.Itemvariant, {
        foreignKey: "item_id",
        as: "variants",
      });
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      selling_price: DataTypes.INTEGER,
      discount_price: DataTypes.INTEGER,
      cost_price: DataTypes.INTEGER,
      unit: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
