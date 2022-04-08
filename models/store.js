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

      Store.belongsTo(models.StoreCategory, {
        foreignKey: "category_id",
        as: "category",
      });
      Store.hasMany(models.Item, {
        foreignKey: "store_id",
        as: "items",
      });
      Store.hasMany(models.ItemCategory, {
        foreignKey: "store_id",
        as: "itemcategories",
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
      business_image_url: DataTypes.STRING,
      url_name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      business_image_url: DataTypes.STRING,
      delivery_charges: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
