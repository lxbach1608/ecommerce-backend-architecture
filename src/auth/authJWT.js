'use strict';

const JWT = require('jsonwebtoken');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.service');

const Headers = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHENTICATION: 'authentication',
};

const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days',
  });

  JWT.verify(accessToken, publicKey, (error, decode) => {
    if (error) {
      console.log('Error verify::', error);
    } else {
      console.log('decode verify::', decode);
    }
  });

  return {
    accessToken,
    refreshToken,
  };
};

const authLogout = async (req, res, next) => {
  // 1. check userId missing?
  // 2. get accessToken
  // 3. verify accessToken
  // 4. check userId in database
  // 5. check access in keyStore and userId
  // 6. all OK => return next()

  const userId = req.headers[Headers.CLIENT_ID];

  const accessToken = req.headers[Headers.AUTHENTICATION];

  if (!userId && !accessToken) {
    throw new AuthFailureError('Invalid request');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundError('Key not found');
  }

  try {
    const decodeAccessToken = JWT.verify(accessToken, keyStore.publicKey);

    if (decodeAccessToken.shopId !== userId) {
      throw new AuthFailureError('Invalid UserId');
    }

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
};

const verifyJWT = (token, publicKey) => {
  const decode = JWT.verify(token, publicKey);

  return decode;
};

module.exports = {
  createTokenPair,
  authLogout,
  verifyJWT,
};
