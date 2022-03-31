const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// signup and create store
exports.signup = async (req, res) => {
  const {
    name,
    phone_number,
    address,
    location,
    url_name,
    category_id,
    password,
  } = req.body;
  const point = {
    type: "Point",
    coordinates: [location.longitude, location.latitude],
  };
  const url = await models.StoreURL.create({
    url_name: url_name,
  });
  await models.Store.create({
    name: name,
    phone_number: phone_number,
    address: address,
    location: point,
    url_id: url.id,
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

// check store url if exists
exports.checkURL = async (req, res) => {
  const { url_name } = req.params;
  await models.StoreURL.findOne({
    where: { url_name: url_name },
  })
    .then((url) => {
      if (url) {
        return res.status(200).json({
          message: "URL already exists",
        });
      } else {
        return res.status(400).json({
          message: "URL not exists",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Error occured while checking URL",
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
