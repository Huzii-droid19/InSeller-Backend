const models = require("../models");

const checkDuplicatePhoneNumber = async (req, res, next) => {
  const { phone_number } = req.body;
  const store = await models.Store.findOne({
    where: { phone_number: phone_number },
  });
  if (store) {
    res.status(400).send({
      message: "Phone number already existed",
      accessToken: null,
      user: null,
    });
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicatePhoneNumber: checkDuplicatePhoneNumber,
};

module.exports = verifySignUp;
