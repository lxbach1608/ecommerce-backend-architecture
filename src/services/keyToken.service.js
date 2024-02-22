'use strict';

const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey, privateKey, refreshToken }) => {
    try {
      // const keyToken = await keyTokenModel.create({
      //   userId: shopId,
      //   publicKey,
      //   privateKey,
      //   refreshToken,
      // });

      // console.log({ keyToken });

      const filter = { userId: shopId };
      const update = { publicKey, privateKey, refreshToken: [], refreshToken };
      const options = { upsert: true, new: true };

      const keyToken = await keyTokenModel.findOneAndUpdate(filter, update, options);

      return keyToken ? keyToken.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static removeByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ userId });
  };

  static findByUserId = async (userId) => {
    const keyToken = await keyTokenModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .lean();

    return keyToken;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ userId });
  };
}

module.exports = KeyTokenService;
