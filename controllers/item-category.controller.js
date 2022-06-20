const models = require("../models");
const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_ACCESS_SECRET,
});

exports.createCategory = async (req, res) => {
  try {
    if (req.file) {
      s3.upload(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: `Categories/${uuidv4()}.${path.extname(req.file.originalname)}`,
          Body: req.file.buffer,
          ACL: "public-read",
        },
        async (err, data) => {
          if (err) {
            return res.status(500).json({
              message: "Error Occured while uploading image",
              error: err.message,
            });
          } else {
            const new_category = await models.ItemCategory.create({
              name: req.body.name,
              image: data.Location,
              object_key: data.Key,
              store_id: req.body.store_id,
            });
            res.status(200).json({
              message: "Category Created Successfully",
              category: new_category,
            });
          }
        }
      );
    } else {
      const new_category = await models.ItemCategory.create({
        name: req.body.name,
        store_id: req.body.store_id,
        image: "",
      });
      if (new_category) {
        res.status(200).json({
          message: "Category Created Successfully",
          category: new_category,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCategories = async (req, res) => {
  await models.ItemCategory.findAll({
    where: {
      store_id: req.params.store_id,
    },
    attributes: ["id", "name", "image", "store_id"],
  })
    .then((categories) => {
      if (categories.length > 0) {
        res.status(200).json(categories);
      } else {
        res.status(404).json(categories);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Occured while fetching categories",
        message: err.message,
      });
    });
};

exports.editCategory = async (req, res) => {
  try {
    const category = await models.ItemCategory.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (category) {
      if (req.file) {
        if (category.image) {
          s3.deleteObject(
            {
              Bucket: process.env.AMAZON_BUCKET_NAME,
              Key: category.object_key,
            },
            (err, data) => {
              if (err) {
                return res.status(500).json({
                  message: "Error Occured while deleting image",
                  error: err.message,
                });
              }
            }
          );
        }

        s3.upload(
          {
            Bucket: process.env.AMAZON_BUCKET_NAME,
            Key: `Categories/${uuidv4()}.${path.extname(
              req.file.originalname
            )}`,
            Body: req.file.buffer,
            ACL: "public-read",
          },
          async (err, data) => {
            if (err) {
              return res.status(500).json({
                message: "Error Occured while uploading image",
                error: err.message,
              });
            } else {
              await models.ItemCategory.update(
                {
                  name: req.body.name,
                  image: data.Location,
                  object_key: data.Key,
                },
                {
                  where: {
                    id: req.body.id,
                  },
                }
              );
              res.status(200).json({
                message: "Category Updated Successfully",
              });
            }
          }
        );
      } else {
        await models.ItemCategory.update(
          {
            name: req.body.name,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );
        res.status(200).json({
          message: "Category Updated Successfully",
        });
      }
    } else {
      res.status(404).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error Occured while updating category",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await models.ItemCategory.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (category) {
    if (category.image) {
      s3.deleteObject(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: category.object_key,
        },
        (err, data) => {
          if (err) {
            return res.status(500).json({
              message: "Error Occured while deleting image",
              error: err.message,
            });
          }
        }
      );
    }
  }
  await models.ItemCategory.destroy({
    where: {
      id: category.id,
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

// web controllers for category
// get cateogries by urlname
exports.getCategoriesByStoreId = async (req, res) => {
  try {
    const categories = await models.ItemCategory.findAll({
      where: {
        store_id: req.params.id,
      },
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while fetching store",
      error: error.message,
    });
  }
};

// get all categories and products by url name
exports.getCategoryAndProductsByStoreUrl = async (req, res) => {
  try {
    const store = await models.Store.findOne({
      where: {
        url_name: req.params.url_name,
      },
    });
    if (store) {
      const categories = await models.ItemCategory.findAll({
        where: {
          store_id: store.id,
        },
        include: [
          {
            model: models.Item,
            as: "items",
            include: [
              {
                model: models.ItemCategory,
                as: "category",
              },
            ],
          },
        ],
      });
      return res.status(200).json(categories);
    } else {
      return res.status(400).json({
        message: "Store not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while fetching store",
      error: error.message,
    });
  }
};

// get category by name
exports.getCategoryByName = async (req, res) => {
  try {
    const category = await models.ItemCategory.findOne({
      where: {
        name: req.params.name,
      },
      include: [
        {
          model: models.Item,
          as: "items",
        },
      ],
    });
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(400).json({
        message: "Category not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while fetching category",
      error: error.message,
    });
  }
};
