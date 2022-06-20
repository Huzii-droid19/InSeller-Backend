const models = require("../models");
const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Pusher = require("pusher");

const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_ACCESS_SECRET,
});

const pusher = new Pusher({
  appId: "1425655",
  key: "1fa354c0285989de6e5a",
  secret: "316dce212e29ccc22e4c",
  cluster: "us2",
  useTLS: true,
});

exports.placeOrder = async (req, res) => {
  try {
    const { trxid, method, store_id, cart, total, customer_details } = req.body;
    let order_no;
    let cart_array = [];
    const details = JSON.parse(customer_details);
    for (let k in JSON.parse(cart)) {
      cart_array.push(JSON.parse(cart)[k]);
    }
    if (req.file !== undefined) {
      s3.upload(
        {
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: `Orders/${uuidv4()}.${path.extname(req.file.originalname)}`,
          Body: req.file.buffer,
          ACL: "public-read",
        },
        async (err, data) => {
          if (err) {
            return res.status(500).json(err.message);
          } else {
            const new_order = await models.Orders.create({
              order_no: `Order #${Math.floor(Math.random() * 1000000)}`,
              payment: {
                method,
                trxid,
                receipt: data.Location,
                object_key: data.Key,
              },
              amount: +total,
              customer_details: details,
              status: "Pending",
              store_id: +store_id,
            });
            order_no = new_order.order_no;
            await models.OrderItem.bulkCreate(
              cart_array.map((item) => {
                return {
                  order_id: new_order.id,
                  item_id: item.item_id,
                  quantity: item.quantity,
                };
              })
            );
          }
        }
      );
    } else {
      const new_order = await models.Orders.create({
        order_no: `Order #${Math.floor(Math.random() * 1000000)}`,
        payment: {
          method,
        },
        amount: +total,
        customer_details: details,
        status: "Pending",
        store_id: +store_id,
      });
      order_no = new_order.order_no;
      await models.OrderItem.bulkCreate(
        cart_array.map((item) => {
          return {
            order_id: new_order.id,
            item_id: item.item_id,
            quantity: item.quantity,
          };
        })
      );
    }

    // const params = {
    //   Message: `Your order has been placed on against your order number ${order_no}`,
    //   PhoneNumber: `+92 ${details.mobile.slice(1)}`,
    //   MessageAttributes: {
    //     "AWS.SNS.SMS.SenderID": {
    //       DataType: "String",
    //       StringValue: "InSeller",
    //     },
    //     "AWS.SNS.SMS.SMSType": {
    //       DataType: "String",
    //       StringValue: "Transactional",
    //     },
    //   },
    // };
    // await amazon_sns
    //   .publish(params)
    //   .promise()
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    pusher.trigger("orders", "new-order", {
      message: `New Order Placed on ${order_no}`,
    });
    return res.status(200).json({
      message: "Order Placed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while placing an order",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await models.Orders.findAll({
      where: {
        store_id: req.params.store_id,
      },
      include: [
        {
          model: models.OrderItem,
          as: "items",
          include: [
            {
              model: models.Item,
              as: "item",
            },
          ],
        },
      ],
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while fetching all orders",
      error: error.message,
    });
  }
};
