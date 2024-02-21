'use strict';

const AccessService = require('../services/access.service');
const { CREATED } = require('../core/success.response');

class AccessController {
  login = async (req, res, next) => {
    new CREATED({
      message: 'Success',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new CREATED({
      message: 'Logout success',
      metadata: await AccessService.logout(req),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
