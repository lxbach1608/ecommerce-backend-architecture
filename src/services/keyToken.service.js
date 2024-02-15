"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async (shopId, publicKey) => {
    const publicKeyString = publicKey.toString();
    try {
      const keyToken = await keyTokenModel.create({
        userId: shopId,
        accessToken: publicKeyString,
      });

      return keyToken ? keyToken : null;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = KeyTokenService;
