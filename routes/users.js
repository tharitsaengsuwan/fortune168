const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { isLoggedIn, isOwner } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    // this middleware use the 'local' strategy to login, it will flash and 'error' message if it fails and redirect you back to '/login'
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.route('/users/:id')
    .get(isLoggedIn, isOwner, catchAsync(users.showUser))
    .put(isLoggedIn, isOwner, catchAsync(users.updateUser))

router.get('/users/:id/edit', isLoggedIn, isOwner, catchAsync(users.renderEditForm));

module.exports = router