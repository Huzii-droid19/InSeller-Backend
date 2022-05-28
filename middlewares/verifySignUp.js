const models = require("../models");

const checkDuplicatePhoneNumber = async (req, res, next) => {
  const { phone_number } = req.body;
  const store = await models.Store.findOne({
    where: { phone_number: phone_number },
  });
  if (store) {
    res.status(400).send("Phone number already existed");
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicatePhoneNumber: checkDuplicatePhoneNumber,
};

module.exports = verifySignUp;
