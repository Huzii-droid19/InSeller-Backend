"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemCategory.hasMany(models.Item, {
        foreignKey: "category_id",
        as: "items",
      });
      ItemCategory.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
      });
    }
  }
  ItemCategory.init(
    {
      name: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
      object_key: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ItemCategory",
    }
  );
  return ItemCategory;
};
