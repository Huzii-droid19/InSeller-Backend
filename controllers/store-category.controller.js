const models = require("../models");

exports.createStoreCategory = async (req, res) => {
  const { name } = req.body;
  await models.StoreCategory.create({
    name: name,
  })
    .then((category) => {
      if (category) {
        return res.status(200).json({
          message: "Store category created successfully",
        });
      } else {
        return res.status(400).json({
          message: "Store category not created",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Error occured while creating a store category",
        error: err.message,
      });
    });
};

exports.getAll = async (req, res) => {
  await models.StoreCategory.findAll()
    .then((categories) => {
      return res.status(200).json(categories);
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Error occured while fetching store categories",
        error: err.message,
      });
    });
};
