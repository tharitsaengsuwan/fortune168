const ExpressError = require('./utils/ExpressError');

// this is a middle ware we will use to check if a user has logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    // isAuthenticated is a method that passport provide for us to check if a user has logged in or not
    if (!req.isAuthenticated()) {
        // we will keep the url that a user is trying to go to, so after that user has logged in, we can take them to a page they tried to go
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    if (id != req.user._id.toString()) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/fortuneTellers')
    }
    next();
}