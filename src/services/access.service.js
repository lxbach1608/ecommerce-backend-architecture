'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const { createTokenPair } = require('../auth/authJWT');
const { getInfoData, cryptoGenerateKeyPair } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const KeyTokenService = require('./keytoken.service');
const ShopService = require('./shop.service');

// this code will define in docs'folder for developers
// which prevent client to notice roles
const roleShop = {
  SHOP: '0001',
  WRITER: '0002',
  EDITOR: '0003',
  ADMIN: '0004',
};

class AccessService {
  // login
  static login = async ({ email, password }) => {
    // 1. check email exist
    const foundedShop = await ShopService.findByEmail({ email });

    // 2.
    if (!foundedShop) {
      throw new BadRequestError('Shop is not registered');
    }

    // 3.
    const matchedPass = await bcrypt.compare(password, foundedShop.password);

    if (!matchedPass) {
      throw new AuthFailureError('Unauthorized');
    }

    const { _id: shopId } = foundedShop;

    const { publicKey, privateKey } = cryptoGenerateKeyPair();

    console.log({ publicKey, privateKey });

    const tokens = createTokenPair({ shopId, email }, publicKey, privateKey);
    const { refreshToken } = tokens;

    console.log({ refreshToken });

    await KeyTokenService.createKeyToken({
      shopId,
      refreshToken,
      publicKey,
      privateKey,
    });

    return {
      metadata: {
        shop: getInfoData({
          obj: foundedShop,
          fields: ['_id', 'name', 'email'],
        }),
        tokens,
      },
    };
  };

  // logout
  static logout = async ({ keyStore }) => {
    const { userId } = keyStore;

    const deletedKey = KeyTokenService.removeByUserId(userId);

    console.log({ deletedKey });

    return deletedKey;
  };

  // signUp
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist ?
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('This email already registered');
    }

    // hash password to prevent hacker or client don't know about this
    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [roleShop.SHOP],
    });

    if (newShop) {
      // create privateKey and publicKey
      // privateKey for sign && publicKey for verify
      const { privateKey, publicKey } = cryptoGenerateKeyPair();

      console.log({ publicKey, privateKey });

      // store publicKey
      const keyToken = await KeyTokenService.createKeyToken({
        shopId: newShop._id,
        publicKey,
        privateKey,
      });

      console.log({ keyToken });

      if (!keyToken) {
        throw new BadRequestError('keyToken error !');

        // return {
        //   code: "xxx",
        //   message: "keyToken error !",
        // };
      }

      const publicKeyObject = crypto.createPublicKey(keyToken); // if use RSA public key

      // create token pair (accessToken and refreshToken)
      const tokens = createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);

      console.log('Created tokens success::', tokens);

      return {
        metadata: {
          shop: getInfoData({ obj: newShop, fields: ['_id', 'name', 'email'] }),
          tokens,
        },
      };
    }

    return {
      metadata: null,
    };
  };
}

module.exports = AccessService;
