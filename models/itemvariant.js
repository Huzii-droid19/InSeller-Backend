"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itemvariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Itemvariant.belongsTo(models.Item, {
        foreignKey: "item_id",
        as: "item",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  Itemvariant.init(
    {
      type: DataTypes.STRING,
      value: DataTypes.STRING,
      item_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Itemvariant",
    }
  );
  return Itemvariant;
};
