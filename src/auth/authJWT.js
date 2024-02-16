"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
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
};

module.exports = {
  createTokenPair,
};
