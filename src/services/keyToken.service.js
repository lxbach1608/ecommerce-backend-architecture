"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();

      const keyToken = await keyTokenModel.create({
        userId: shopId,
        publicKey: publicKeyString,
      });

      return keyToken ? keyToken.publicKey : null;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = KeyTokenService;
