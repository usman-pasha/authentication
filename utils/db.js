const mongoose = require("mongoose");
const logger = require("./log");

logger.info("Connecting to Database...");
module.exports.openDBConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const connection = mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info("Connected to MongoDB DataBase");
      return connection;
    } catch (err) {
      logger.error(
        "MongoDB connection error. Please make sure MongoDB is running. "
      );
      throw new Error(err);
    }
  }
};

module.exports.closeDBConnection = async (db) => {
  if (db) {
    await db.disconnect();
    logger.info("Connection closed");
  }
};
