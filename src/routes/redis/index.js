const express = require('express');
const { asyncHandler } = require('../../helpers/handleUtils');
const RedisController = require('../../controllers/redisController');
const router = express.Router();
router.post('',asyncHandler(RedisController.setRedis))
router.get('/:key',asyncHandler(RedisController.getRedis))
module.exports = router;
