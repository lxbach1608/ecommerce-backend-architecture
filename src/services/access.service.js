'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const { createTokenPair, verifyJWT } = require('../auth/authJWT');
const { getInfoData, cryptoGenerateKeyPair } = require('../utils');
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response');
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

      // store publicKey
      const keyToken = await KeyTokenService.createKeyToken({
        shopId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyToken) {
        throw new BadRequestError('keyToken error !');
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

  static handleRefreshToken = async ({ refreshToken }) => {
    // 1. check 'refreshToken' exists in refreshTokenUsed
    // 2. if exist => decode accessToken to check who use this?
    // 2.1 delete all tokens in keyToken
    // 3. if not exist => check accessToken is using right now ? are we created it ?
    // 4. decode token
    // 5. checking email to check valid shop
    // 6. create new tokens(refreshToken and accessToken)
    // 7. update refreshToken and set old refreshToken to refreshTokenUsed
    // 8 return both token

    console.log({ refreshToken });

    if (!refreshToken) {
      throw new AuthFailureError('refreshToken missing!');
    }

    // 1.
    const foundedToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

    console.log({ foundedToken });

    // 2.
    if (foundedToken) {
      console.log({ foundedToken });

      const decode = verifyJWT(refreshToken, foundedToken.publicKey);

      const { userId } = decode;

      console.log({ decode });

      await KeyTokenService.deleteByUserId(userId);

      throw new NotFoundError('Something went wrong! please login again.');
    }

    // 3.
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    console.log({ holderToken });

    if (!holderToken) throw AuthFailureError('Shop is not registered');

    // 4.
    const decode = verifyJWT(refreshToken, holderToken.publicKey);

    const { userId, email } = decode;

    console.log({ decode });

    // 5.
    const foundedShop = await ShopService.findByEmail({ email });
    const { publicKey, privateKey } = holderToken;

    console.log({ foundedShop });

    if (!foundedShop) throw AuthFailureError('Shop is not registered');

    // 6.
    const tokens = createTokenPair({ userId, email }, publicKey, privateKey);

    // 7.
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
