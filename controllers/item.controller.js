const models = require("../models");
const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_ACCESS_SECRET,
});

exports.createItem = async (req, res) => {
  try {
    if (req.file) {
      s3.upload(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: `Items/${uuidv4()}.${path.extname(req.file.originalname)}`,
          Body: req.file.buffer,
          ACL: "public-read",
        },
        async (err, data) => {
          if (err) {
            return res.status(500).json(err.message);
          } else {
            const new_item = await models.Item.create({
              name: req.body.name,
              category_id: req.body.category_id,
              description: req.body.description,
              selling_price: req.body.selling_price,
              discount_price: req.body.discount_price,
              cost_price: req.body.cost_price,
              unit: req.body.unit,
              quantity: req.body.quantity,
              store_id: req.body.store_id,
              status: req.body.status,
              image: data.Location,
              object_key: data.Key,
            });
            res.status(200).json({
              message: "Item Created Successfully",
              item: new_item,
            });
          }
        }
      );
    } else {
      const new_item = await models.Item.create({
        name: req.body.name,
        category_id: req.body.category_id,
        description: req.body.description,
        selling_price: req.body.selling_price,
        discount_price: req.body.discount_price,
        cost_price: req.body.cost_price,
        unit: req.body.unit,
        quantity: req.body.quantity,
        store_id: req.body.store_id,
        status: req.body.status,
      });
      res.status(200).json({
        message: "Item Created Successfully",
        item: new_item,
      });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.getAllItems = async (req, res) => {
  await models.Item.findAll({
    where: {
      store_id: req.params.store_id,
    },
  })
    .then((items) => {
      if (items.length > 0) {
        res.status(200).json(items);
      } else {
        res.status(404).json(items);
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
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
  try {
    const item = await models.Item.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (item) {
      if (req.file) {
        if (item.image) {
          s3.deleteObject(
            {
              Bucket: process.env.AMAZON_BUCKET_NAME,
              Key: item.object_key,
            },
            (err, data) => {
              if (err) {
                return res.status(500).json(err.message);
              }
            }
          );
        }
        s3.upload(
          {
            Bucket: process.env.AMAZON_BUCKET_NAME,
            Key: `Items/${uuidv4()}.${path.extname(req.file.originalname)}`,
            Body: req.file.buffer,
            ACL: "public-read",
          },
          async (err, data) => {
            if (err) {
              return res.status(500).json(err.message);
            } else {
              await models.Item.update(
                {
                  name: req.body.name,
                  category_id: req.body.category_id,
                  description: req.body.description,
                  selling_price: req.body.selling_price,
                  discount_price: req.body.discount_price,
                  cost_price: req.body.cost_price,
                  unit: req.body.unit,
                  quantity: req.body.quantity,
                  store_id: req.body.store_id,
                  status: req.body.status,
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
                message: "Item Updated Successfully",
              });
            }
          }
        );
      } else {
        // image not uploaded
        await models.Item.update(
          {
            name: req.body.name,
            category_id: req.body.category_id,
            description: req.body.description,
            selling_price: req.body.selling_price,
            discount_price: req.body.discount_price,
            cost_price: req.body.cost_price,
            unit: req.body.unit,
            quantity: req.body.quantity,
            store_id: req.body.store_id,
            status: req.body.status,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );
        res.status(200).json({
          message: "Item Updated Successfully",
        });
      }
    } else {
      // no category found
      res.status(400).json("No Category Found");
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    console.log(req.params.id);
    const item = await models.Item.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (item) {
      if (item.image) {
        s3.deleteObject(
          {
            Bucket: process.env.AMAZON_BUCKET_NAME,
            Key: item.object_key,
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
      await models.Item.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        message: "Item Deleted Successfully",
      });
    } else {
      res.status(404).json({
        message: "No Item Found",
      });
    }
  } catch (error) {}
};

exports.getItemByName = async (req, res) => {
  await models.Item.findOne({
    where: {
      name: req.params.name,
    },
  })
    .then((item) => {
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json(item);
      }
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
};
