const userModel = require("../models/user.model");
const logger = require("../utils/log");
const bcrypt = require("bcryptjs");
const tokenService = require("./token");
const userService = require("./user");

module.exports.createRecord = async (payload) => {
  const record = await userModel.create(payload);
  return record;
};

module.exports.createRegister = async (body, query) => {
  logger.info("creating admin register");
  if (!body.email || !body.username || !body.phoneNumber) {
    throw new Error("Required Parameter!");
  }
  const isEmailExists = await userService.findUser({
    email: body.email,
    emailisVerified: true,
  });
  if (isEmailExists) {
    throw new Error("Already Email is Exists!");
  }
  // check username
  const isUserNameExists = await userService.findUser({
    username: body.username,
  });
  if (isUserNameExists) throw new Error("Already username is Exists!");
  // check phoneNumber if exists
  const isPhoneNumberExists = await userService.findUser({
    phoneNumber: body.phoneNumber,
  });
  if (isPhoneNumberExists) throw new Error("Already phonenumber is Exists!");

  const password = await bcrypt.hash(body.password, 10);
  const payload = {
    firstName: body.firstName,
    lastName: body.lastName,
    username: body.username,
    email: body.email,
    password: password,
    phoneNumber: body.phoneNumber,
    accountType: "admin",
    accessLevel: body.accessLevel,
  };
  logger.info(payload);
  const record = await this.createRecord(payload);
  return record;
};

module.exports.authLogin = async (body, query) => {
  logger.info("login service Starting");
  if (!body.type) throw new Error("type is Required!");
  let filter = {};
  let credential = "";
  switch (body.type) {
    case "email":
      if (!body.email || !body.password)
        throw new Error("Required Email and Password!");
      filter = {
        email: body.email,
        status: "active",
      };
      credential = "email";
      break;
    case "phone":
      if (!body.phoneNumber || !body.password)
        throw new Error("Required Phonenumber and password!");
      filter = {
        phoneNumber: body.phoneNumber,
        status: "active",
      };
      credential = "phoneNumber";
      break;
    case "username":
      if (!body.username || !body.password)
        throw new Error("Required Username and password!");
      filter = {
        username: body.username,
        status: "active",
      };
      credential = "username";
      break;
    default:
      throw new Error("Required Type!");
  }
  logger.info(`${credential}`);
  const user = await userService.getOnlyUser(filter);
  logger.data("User info fetched", user);

  if (!user) {
    throw new Error("User Not Found!");
  }
  if (!(await bcrypt.compare(body.password, user.password))) {
    throw new Error("Invalid Password!");
  }
  logger.info("Sending token to the user");

  const record = await tokenService.createLogin(user);
  return record;
};

module.exports.refreshToken = async (body) => {
  const condition = { refreshToken: body.refreshToken };
  const refresh = await tokenService.findOneToken(condition);
  if (!refresh) {
    throw new Error("Invalid Refresh Token!");
  }
  const refreshToken = await tokenService.tokenVerify(body.refreshToken);
  if (refreshToken) {
    const accessToken = await tokenService.signToken(refresh.id);
    logger.success("at", accessToken);
    const updateData = {
      jwtToken: accessToken,
    };
    const record = await tokenService.updateToken(
      { _id: refresh.id },
      updateData
    );
    return record;
  } else {
    throw new Error("Invalid Verify Refresh Token!");
  }
};

module.exports.logoutUser = async (body) => {
  const condition = { refreshToken: body.refreshToken };
  const logout = await tokenService.findOneToken(condition);
  if (!logout) {
    throw new Error("Invalid Refresh Token!");
  }
  const record = await tokenService.deleteToken(logout._id);
  return record;
};
