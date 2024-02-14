const express = require("express");
const Database = require("./db/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");

require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init database
Database.connect();
checkOverload();

// init routes
app.get("/", (req, res, next) => {
  const compressStr = "repeating...";

  return res.status(200).json({
    message: "success",
    metadata: compressStr.repeat(10000),
  });
});

// handling error

module.exports = app;
