const mongoose = require("mongoose");
require("dotenv").config();

const mongodb_uri = process.env.MONGODB_URI;

mongoose
  .connect(mongodb_uri, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Connection okB");
  })
  .catch((err) => {
    console.log(err);
  });
