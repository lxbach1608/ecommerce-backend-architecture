"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
};

const checkApiKey = async (req, res, next) => {
  const apiKey = req.headers[HEADER.API_KEY]?.toString();

  if (!apiKey) {
    res.status(403).json({
      code: "1xx1",
      message: "Forbidden error",
    });
  }

  const apiKeyObj = await findById(apiKey);

  if (!apiKeyObj) {
    res.status(403).json({
      code: "1xx2",
      message: "Forbidden error",
    });
  }

  req.apiKeyObj = apiKeyObj;

  return next();
};

const checkPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.apiKeyObj.permissions) {
      res.status(403).json({
        code: "2xx1",
        message: "Permission denied",
      });
    }

    console.log("Permissions::", req.apiKeyObj.permissions);

    const validPermissions = req.apiKeyObj.permissions.includes(permissions);

    if (!validPermissions) {
      res.status(403).json({
        code: "2xx2",
        message: "Permission denied",
      });
    }

    return next();
  };
};

module.exports = {
  checkApiKey,
  checkPermission,
};
