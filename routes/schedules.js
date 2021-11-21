const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner } = require('../middleware');
const schedules = require('../controllers/schedules');

router.route('/:id')
    //this is schedule's id
    .delete(isLoggedIn, catchAsync(schedules.deleteAppointment))
    .put(isLoggedIn, catchAsync(schedules.updateAppointment))

module.exports = router