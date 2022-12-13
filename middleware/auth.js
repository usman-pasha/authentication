const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const logger = require("../utils/log");
const coreDB = require("../utils/db");

module.exports.verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  await coreDB.openDBConnection();
  try {
    if (!bearerHeader)
      return res.status(401).send({
        message: "authorization header not Found!",
      });
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    logger.data("token", bearerToken);
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    logger.data("decoded", decoded);
    const createdate = new Date(decoded.iat * 1000);
    logger.data("createdate", createdate);
    const expires = new Date(decoded.exp * 1000);
    logger.data("expires", expires);
    const userId = decoded.id;
    console.log(userId);

    const filter = {
      _id: userId,
    };
    const projection = {
      _id: 1,
      accountType: 1,
      accessLevel: 1,
    };

    const user = await userModel.find(filter, projection).sort({
      createdOn: -1,
    });
    if (user) {
      logger.info("user" + user);
      if (!user.length) throw new Error("User Does Not Exist");
      req.accountType = user[0].accountType;
      req.userId = userId;
      logger.info("userid." + req.userId);
      req.user = user[0];
      next();
    }
  } catch (err) {
    logger.error(err);
    res.status(401).send({
      message: err.message,
      success: false,
    });
  }
};

module.exports.restrictTo = (...accessLevel) => {
  return (req, res, next) => {
    if (req.accountType == "admin" && accessLevel[0] == "any") return next();
    if (
      !(
        req.accountType == "admin" &&
        accessLevel.some((access) => req.user.accessLevel.includes(access))
      )
    ) {
      res.status(403).send({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    } else {
      next();
    }
  };
};
