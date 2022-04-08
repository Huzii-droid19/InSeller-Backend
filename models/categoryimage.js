"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryImage.belongsTo(models.ItemCategory, {
        foreignKey: "category_id",
        as: "category",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  CategoryImage.init(
    {
      category_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CategoryImage",
    }
  );
  return CategoryImage;
};
