"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "ItemCategories",
          key: "id",
        },
        onDelete: "cascade",
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      selling_price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      discount_price: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cost_price: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      unit: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      store_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Stores",
          key: "id",
        },
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Items");
  },
};
