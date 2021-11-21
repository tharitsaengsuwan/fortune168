const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const extrainfotypes = require('../controllers/extrainfotypes');
const { isLoggedIn, isOwner, isCustomer, isProvider } = require('../middleware');

router.route('/:id/new')
    .get(isLoggedIn, isOwner, isProvider, catchAsync(extrainfotypes.renderNewForm))
    .post(isLoggedIn, isOwner, isProvider, catchAsync(extrainfotypes.createNewType))

router.route('/:id/:typeid/edit')
    .get(isLoggedIn, isOwner, isProvider, catchAsync(extrainfotypes.renderEditForm))

router.route('/:id/:typeid')
    .put(isLoggedIn, isOwner, isProvider, catchAsync(extrainfotypes.editType))
    .delete(isLoggedIn, isOwner, isProvider, catchAsync(extrainfotypes.deleteType))

module.exports = router