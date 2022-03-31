"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StoreURL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StoreURL.hasOne(models.Store, {
        foreignKey: "url_id",
        as: "url",
        hooks: true,
        onDelete: "CASCADE",
      });
    }
  }
  StoreURL.init(
    {
      url_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StoreURL",
    }
  );
  return StoreURL;
};
