"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_no: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      payment: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      customer_details: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Accepted", "Cancelled", "Delivered"),
      },
      store_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Stores",
          key: "id",
        },
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
    await queryInterface.dropTable("Orders");
  },
};
