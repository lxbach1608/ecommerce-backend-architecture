'use strict';

const express = require('express');
const router = express.Router();
const { checkApiKey, checkPermission } = require('../auth/checkAuth');

// check apiKey
router.use(checkApiKey);

// check permissions
router.use(checkPermission('0000'));

const accessRouter = require('./access');

router.use('/v1/api', accessRouter);

module.exports = router;
