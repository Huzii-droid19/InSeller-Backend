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
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
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
  try {
    const category = await models.ItemCategory.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (category) {
      if (req.file) {
        if (category.image) {
          console.log("image here");
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
