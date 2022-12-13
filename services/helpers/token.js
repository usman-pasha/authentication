
const jwt = require("jsonwebtoken");
const logger = require("../../utils/log");

module.exports.signToken = (id, type) => {
  let secret;
  let tokenValidity;
  switch (type) {
    case "access":
      secret = process.env.JWT_SECRET;
      tokenValidity = process.env.ACCESS_TOKEN_VALIDITY
      break;
    case "refresh":
      secret = process.env.REFRESH_SECRET;
      tokenValidity = process.env.REFRESH_TOKEN_VALIDITY;
      break;
    default:
      throw new Error("Invalid Access Token Type");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: tokenValidity,
  });
};

module.exports.verifyToken = async (token, type) => {
  let secret;
  switch (type) {
    case "access":
      secret = process.env.JWT_SECRET;
      break;
    case "refresh":
      secret = process.env.REFRESH_SECRET;
      break;
    default:
      throw new Error("Invalid Access Token Type");
  }
  try {
    return await promisify(jwt.verify)(token, secret);
  } catch (error) {
    logger.error("Token verification Failed");
    throw error;
  }
};