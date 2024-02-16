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
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init database
Database.connect();
checkOverload();

// init routes
const router = require("./routes");
app.use("/", router);

// handling error

module.exports = app;
