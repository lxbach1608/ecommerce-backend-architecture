"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const { createTokenPair } = require("../utils/authJWT.util");
const KeyTokenService = require("./keyToken.service");

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
    // step 1: check email exist ?
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      return {
        code: "xxx",
        message: "this email already registered !",
      };
    }

    // hash password to prevent hacker or client don't know about this
    hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [roleShop.SHOP],
    });

    if (newShop) {
      // create privateKey and publicKey
      // privateKey for sign && publicKey for verify
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
      });

      console.log("privateKey::" + privateKey);
      console.log("publicKey::" + publicKey);

      // store publicKey
      const keyToken = await KeyTokenService.createKeyToken(
        newShop._id,
        publicKey
      );

      if (!keyToken) {
        return {
          code: "xxx",
          message: "keyToken error !",
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        privateKey,
        publicKey
      );

      console.log("Created tokens success::", tokens);

      return {
        code: 201,
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
