"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ItemImage.belongsTo(models.Item, {
        foreignKey: "item_id",
        as: "item",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  ItemImage.init(
    {
      item_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
      object_key: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ItemImage",
    }
  );
  return ItemImage;
};
