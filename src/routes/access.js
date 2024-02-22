'use strict';

const express = require('express');
const router = express.Router();
const accessController = require('../controllers/access.controller');
const { asyncHandler } = require('../utils');
const { authLogout } = require('../auth/authJWT');

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authLogout);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
