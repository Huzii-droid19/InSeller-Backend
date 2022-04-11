const models = require("../models");

exports.createCategory = async (req, res) => {
  console.log(req.body);
  await models.ItemCategory.create({
    name: req.body.name,
    store_id: req.body.store_id,
    image: req.body.image,
  })
    .then((result) => {
      res.status(200).json({
        message: "Category Created Successfully",
        category: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while creating category",
        message: err.message,
      });
    });
};

exports.getAllCategories = async (req, res) => {
  await models.ItemCategory.findAll({
    where: {
      store_id: req.params.store_id,
    },
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          message: "Categories Fetched Successfully",
          categories: result,
        });
      } else {
        res.status(404).json({
          message: "No Categories found",
          categories: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching categories",
        message: err.message,
      });
    });
};

exports.getAllCategoriesProducts = async (req, res) => {
  await models.ItemCategory.findAll({
    where: {
      store_id: req.params.store_id,
    },
    include: [
      {
        model: models.Item,
        as: "items",
        include: [
          {
            model: models.ItemImage,
            as: "images",
          },
        ],
      },
    ],
  })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({
          message: "Categories Fetched Successfully",
          categories: result,
        });
      } else {
        res.status(404).json({
          message: "No Categories found",
          categories: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching categories",
        message: err.message,
      });
    });
};

exports.getCategoryById = async (req, res) => {
  await models.ItemCategory.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Category Fetched Successfully",
          category: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to fetch category",
          category: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching category",
        message: err.message,
      });
    });
};

exports.editCategory = async (req, res) => {
  await models.ItemCategory.update(
    {
      name: req.body.name,
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
          message: "Category Updated Successfully",
          category: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to update category",
          category: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while updating category",
        message: err.message,
      });
    });
};

exports.deleteCategory = async (req, res) => {
  await models.ItemCategory.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Category Deleted Successfully",
          category: result,
        });
      } else {
        res.status(400).json({
          message: "Unable to delete category",
          category: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while deleting category",
        message: err.message,
      });
    });
};
