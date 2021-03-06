"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("CREATE EXTENSION postgis;");
    await queryInterface.createTable("Stores", {
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
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: false,
        type: Sequelize.GEOMETRY,
      },
      business_image_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "StoreCategories", key: "id" },
        onDelete: "CASCADE",
      },
      delivery_charges: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Stores");
    await queryInterface.sequelize.query("DROP EXTENSION postgis;");
  },
};
