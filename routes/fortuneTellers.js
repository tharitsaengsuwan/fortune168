const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isOwner, isCustomer, isProvider } = require('../middleware');
const fortuneTellers = require('../controllers/fortuneTellers');

router.route('/')
    .get(catchAsync(fortuneTellers.index))

router.route('/:id')
    .get(catchAsync(fortuneTellers.showFortuneTeller))
    .post(isLoggedIn, isCustomer, catchAsync(fortuneTellers.makeAppointment))

module.exports = router