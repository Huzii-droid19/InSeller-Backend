"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StoreCategory.hasOne(models.Store, {
        foreignKey: "category_id",
        as: "category",
        hooks: true,
        onDelete: "CASCADE",
      });
    }
  }
  StoreCategory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StoreCategory",
    }
  );
  return StoreCategory;
};
