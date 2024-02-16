"use strict";

const mongoose = require("mongoose");
const shopModel = require("../models/shop.model");
const AccessService = require("../services/access.service");

class AccessController {
  static signUp = async (req, res, next) => {
    try {
      const data = await AccessService.signUp(req.body);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AccessController;
