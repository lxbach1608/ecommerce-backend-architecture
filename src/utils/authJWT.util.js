"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log("Error verify::", error);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
