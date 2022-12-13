const userModel = require("../models/user.model");
const logger = require("../utils/log");
// const AppError = require("../utils/error/appError");
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require("bcryptjs");

module.exports.createRecord = async (payload) => {
  const record = await userModel.create(payload);
  return record;
};

//for validation
module.exports.findUser = async (condition) => {
  const user = await userModel.findOne(condition);
  return user;
};

//for login
module.exports.getOnlyUser = async (condition) => {
  if (!condition.status) condition.status = { $ne: "deleted" };
  const user = await userModel.findOne(condition);
  return user;
};

module.exports.updateRecord = async (condition, updateQuery) => {
  const option = { new: true };
  const record = await userModel.findOneAndUpdate(
    { _id: condition },
    updateQuery,
    option
  );
  return record;
};
