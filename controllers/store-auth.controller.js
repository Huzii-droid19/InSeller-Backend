const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// signup and create store
exports.signup = async (req, res) => {
  const { name, phone_number, address, location, category_id, password } =
    req.body;
  const point = {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  };
  const url_name =
    name.replace(/\s+/g, "-").toLowerCase() + Math.floor(Math.random() * 10000);
  await models.Store.create({
    name: name,
    phone_number: phone_number,
    address: address,
    location: point,
    url_name: url_name,
    category_id,
    password: bcrypt.hashSync(password, 10),
  })
    .then((store) => {
      if (store) {
        const token = jwt.sign({ id: store.id }, process.env.STORE_SECERET, {
          expiresIn: "1d",
        });
        return res.status(200).json({
          message: "Store created successfully",
          accessToken: token,
          user: store,
        });
      } else {
        return res.status(400).json({
          message: "Store not created due to bad request",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message:
          "Error occured while creating a store, please contact adminstrator or report it to playstore",
        error: err.message,
      });
    });
};

// sign into store
exports.signIn = async (req, res) => {
  await models.Store.findOne({
    where: {
      phone_number: req.body.phone_number,
    },
  })
    .then((store) => {
      if (store) {
        if (bcrypt.compareSync(req.body.password, store.password)) {
          const token = jwt.sign({ id: store.id }, process.env.STORE_SECERET, {
            expiresIn: "1d",
          });
          return res.status(200).json({
            message: "Store logged in successfully",
            accessToken: token,
            user: store,
          });
        } else {
          return res.status(400).json({
            message: "Incorrect password",
          });
        }
      } else {
        return res.status(400).json({
          message: "Store not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Error occured while logging in",
        error: err.message,
      });
    });
};

exports.getStoreByURL = async (req, res) => {
  await models.Store.findOne({
    where: {
      url_name: req.params.url_name,
    },
    attributes: ["id", "name", "url_name"],
  })
    .then((store) => {
      if (store) {
        return res.status(200).json({
          message: "Store fetched successfully",
          store: store,
        });
      } else {
        return res.status(400).json({
          message: "Store not found",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Error occured while fetching store",
        error: err.message,
      });
    });
};
