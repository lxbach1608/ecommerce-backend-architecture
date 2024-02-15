"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");

// this code will define in docs'folder for developers
// which prevent client to notice roles
const roleShop = {
  SHOP: "0001",
  WRITER: "0002",
  EDITOR: "0003",
  ADMIN: "0004",
};

class AccessService {
  // signUp
  static signUp = async (name, email, password) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      return res.status(200).json({
        code: "xxx",
        message: "this email already registered !!",
      });
    }

    // hash password to prevent hacker or client don't know about this
    hashedPassword = await bcrypt.hash(password, 10);

    const shop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [roleShop.SHOP],
    });

    if (shop) {
      // create privateKey and publicKey
      // privateKey for sign && publicKey for verify
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
      });

      console.log("privateKey::" + privateKey);
      console.log("publicKey::" + publicKey);
    }
  };
}
