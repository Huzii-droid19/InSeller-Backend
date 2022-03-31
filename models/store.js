"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.belongsTo(models.StoreURL, {
        foreignKey: "url_id",
        as: "url",
      });
      Store.belongsTo(models.StoreCategory, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  Store.init(
    {
      name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      location: DataTypes.GEOMETRY,
      password: DataTypes.STRING,
      url_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
