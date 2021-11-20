const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner } = require('../middleware');
const schedules = require('../controllers/schedules');

router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(schedules.showSchedules))