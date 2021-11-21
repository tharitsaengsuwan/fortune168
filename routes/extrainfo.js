const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const extrainfo = require('../controllers/extrainfo');
const { isLoggedIn, isOwner, isCustomer, isProvider } = require('../middleware');

router.route('/:id/:infoid/edit')
    .get(isLoggedIn, isOwner, isCustomer, catchAsync(extrainfo.renderEditForm))

router.route('/:id/:infoid')
    .put(isLoggedIn, isOwner, isCustomer, catchAsync(extrainfo.editInfo))
    .delete(isLoggedIn, isOwner, isCustomer, catchAsync(extrainfo.deleteInfo))

module.exports = router