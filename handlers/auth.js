const coreDB = require("../utils/db");
const express = require("express");
const app = express();
const serverless = require("serverless-http");
const logger = require("../utils/log");
const authService = require("../services/auth");
const authorized = require("../middleware/auth");
const tokenService = require("../services/token");
const cors = require("cors");
app.use(cors());

const authRegister = async (req, res) => {
  await coreDB.openDBConnection();
  try {
    logger.info("Auth Registration Started");
    const body = JSON.parse(req.body);
    const data = await authService.createRegister(body);
    logger.info(data);
    return res.status(200).send({
      message: `Successfully ${data.accountType} Register`,
      data: data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(404).send({
      message: error.message,
    });
  }
};

const authLogin = async (req, res) => {
  await coreDB.openDBConnection();
  try {
    logger.info("Auth Login Started");
    const body = JSON.parse(req.body);
    const data = await authService.authLogin(body);
    logger.info(data);
    return res.status(200).send({
      message: `successfully ${data.type} login`,
      data: data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(404).send({
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  await coreDB.openDBConnection();
  try {
    logger.info("refreshToken Started");
    const body = JSON.parse(req.body);
    const data = await authService.refreshToken(body);
    logger.info(data);
    return res.status(200).send({
      message: "successfully Access Token Generated",
      data: data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(404).send({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  await coreDB.openDBConnection();
  try {
    logger.info("logout Started");
    const body = JSON.parse(req.body);
    const data = await authService.logoutUser(body);
    logger.info(data);
    return res.status(200).send({
      message: "successfully User logout",
      data: data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(404).send({
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  await coreDB.openDBConnection();
  try {
    logger.info("profile Api Started");
    logger.data("id", req.user.accessLevel);
    const data = req.owner;
    logger.info(data);
    return res.status(200).send({
      message: "successfully user profile ",
      data: data,
    });
  } catch (error) {
    logger.error(error);
    return res.status(404).send({
      message: error.message,
    });
  }
};

app.post("/auth/register", authRegister);
app.post("/auth/login", authLogin);
app.post("/auth/refresh", refreshToken);
app.delete("/auth/logout", logout);

app.use(authorized.verifyToken);

app.get("/auth/me", authorized.restrictTo("admin"), me);

module.exports.handler = serverless(app, {
  callbackWaitForEmptyEventLoop: false,
});
