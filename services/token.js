const tokenModel = require("../models/token.model");
const { signToken } = require("./helpers/token");
const logger = require("../utils/log");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.createLogin = async (user) => {
  logger.info("inside login response");
  const id = user._id;
  const payload = {
    user: id,
    jwtToken: signToken(id, "access"),
    refreshToken: signToken(id, "refresh"),
  };
  const token = await tokenModel.create(payload);
  logger.data("token save in database", token);
  return {
    token: token.jwtToken,
    refreshToken: token.refreshToken,
    type: user.accountType,
    email: user.email,
    phoneNumber: user.phoneNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  };
};

module.exports.findOneToken = async (tokenId) => {
  const token = await tokenModel.findOne(tokenId);
  return token;
};

module.exports.deleteToken = async (tokenId) => {
  const token = await tokenModel.findByIdAndDelete(tokenId);
  return token;
};

module.exports.updateToken = async (id, updatedata) => {
  const record = await tokenModel.findOneAndUpdate(id, updatedata, {
    new: true,
  });
  return record;
};

module.exports.signToken = async (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 900, // expires in 15 min
  });
  return token;
};

module.exports.tokenVerify = async (token) => {
  const record = jwt.verify(token, process.env.JWT_SECRET);
  return record;
};

module.exports.refreshToken = async (id) => {
  const token = jwt.sign({ id: id }, process.env.REFRESH_SECRET, {
    //expiresIn: 86400 // expires in 24 hours
    expiresIn: "30d",
  });
  return token;
};
