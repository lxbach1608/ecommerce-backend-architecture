"use strict";

const mongoose = require("mongoose");
const { checkCountConnect } = require("../helpers/check.connect");

const _CONNECTION_STR = "mongodb://localhost:27017/backendArchitecture";

// singleton pattern
class Database {
  instance = null;

  constructor() {
    this.connect();
  }

  static async connect(type = "mongodb") {
    // Example DEV mode
    if (1 === 1) {
      mongoose.set("debug", true);

      mongoose.set("debug", { color: true });
    }

    this.instance = await mongoose
      .connect(_CONNECTION_STR, { maxPoolSize: 50 })
      .then((_) => {
        console.log("Connected to mongodb");

        checkCountConnect();
      })
      .catch((_) => {
        console.log("Failed to connect to mongodb");
      });
  }

  getInstance() {
    if (this.instance === null) {
      this.instance = new Database();
    }

    return instance;
  }
}

module.exports = Database;
