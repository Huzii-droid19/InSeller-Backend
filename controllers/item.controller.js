const models = require("../models");

exports.createItem = async (req, res) => {
  const {
    name,
    category_id,
    description,
    selling_price,
    discount_price,
    cost_price,
    unit,
    quantity,
    store_id,
    images,
  } = req.body;
  console.log(req.body);
  await models.Item.create({
    name: name,
    category_id: category_id,
    description: description,
    selling_price: selling_price,
    discount_price: discount_price,
    cost_price: cost_price,
    unit: unit,
    quantity: quantity,
    store_id: store_id,
  })
    .then(async (result) => {
      if (result) {
        if (images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            models.ItemImage.create({
              item_id: result.id,
              image: images[i],
            });
          }
        }
        const newItem = await models.Item.findOne({
          where: {
            id: result.id,
          },
          include: [
            {
              model: models.ItemImage,
              attributes: ["image"],
              as: "images",
            },
          ],
        });

        res.status(200).json({
          message: "Item Added Successfully",
          item: newItem,
        });
      } else {
        res.status(400).json({
          message: "Unable to add item",
          item: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while adding an Item",
        message: err.message,
      });
    });
};

exports.getAllItems = async (req, res) => {
  await models.Item.findAll({
    where: {
      store_id: req.params.store_id,
    },
    include: [
      {
        model: models.ItemImage,
        attributes: ["image"],
        as: "images",
      },
    ],
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          message: "Items Fetched Successfully",
          items: result,
        });
      } else {
        res.status(404).json({
          message: "No Items Avaliable",
          items: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching items",
        message: err.message,
      });
    });
};

exports.getItemById = async (req, res) => {
  await models.Item.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Item Fetched Successfully",
          item: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to fetch item",
          item: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching item",
        message: err.message,
      });
    });
};

exports.editItem = async (req, res) => {
  const {
    name,
    category_id,
    description,
    selling_price,
    discount_price,
    cost_price,
    unit,
    quantity,
    store_id,
  } = req.body;
  await models.Item.update(
    {
      name: name,
      category_id: category_id,
      description: description,
      selling_price: selling_price,
      discount_price: discount_price,
      cost_price: cost_price,
      unit: unit,
      quantity: quantity,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Item Updated Successfully",
          item: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to update item",
          item: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while updating item",
        message: err.message,
      });
    });
};

exports.deleteItem = async (req, res) => {
  await models.Item.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Item Deleted Successfully",
          item: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to delete item",
          item: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while deleting item",
        message: err.message,
      });
    });
};
