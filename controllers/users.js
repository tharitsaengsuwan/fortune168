const User = require('../models/user');
const app = require('../app.js');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try {
        const { FirstName, LastName, PhoneNo, BirthDate, Address, role, WorkExp, CarRegNum, BloodGroup, username, password } = req.body;
        const user = new User({ FirstName, LastName, BirthDate, PhoneNo, Address, role, username });
        // we just pass user instance and a plain password, then passport is gonna take care of hashing and adding salt for us
        const registerUser = await User.register(user, password);
        const newUserID = registerUser._id.toString();
        const newUserPassword = registerUser.hash.toString();
        if (role == 'customer') {
            const sqlText = "call create_customer_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @output)";
            const sqlParams = [newUserID, CarRegNum, BloodGroup, PhoneNo, FirstName, LastName, BirthDate, Address, username, newUserPassword];
            app.pool.query(sqlText, sqlParams, function(error, results, fields) {
                if (error) {
                    return next(error);
                }
                req.login(registerUser, err => {
                    if (err) return next(err);
                    req.flash('success', 'created new user!');
                    res.redirect('/fortuneTellers');
                })
            });
        } else {
            const sqlText = "call create_provider_user(?, ?, ?, ?, ?, ?, ?, ?, ?, @output)";
            const sqlParams = [newUserID, WorkExp, PhoneNo, FirstName, LastName, BirthDate, Address, username, newUserPassword];
            app.pool.query(sqlText, sqlParams, function(error, results, fields) {
                if (error) {
                    return next(error);
                }
                return req.login(registerUser, err => {
                    if (err) return next(err);
                    req.flash('success', 'created new user!');
                    res.redirect('/fortuneTellers');
                })
            });
        }
        // we should log a new user in imediately after they signed up
        // this req.login method doesnt suport 'await' so we have to use callback function here
        // req.login(registerUser, err => {
        //     if (err) return next(err);
        //     req.flash('success', 'created new user!');
        //     res.redirect('/fortuneTellers');
        // })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    // we check if a user has tried to go to some page before, if that is the case, we will redirect them to that page instead of '/campgrounds' page
    const redirectUrl = req.session.returnTo || '/fortuneTellers'
        // dont forget to delete returnTo from our session, otherwise it will just sit in there
        // this is how we delete sth from an object
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    // this is a method that passport provide for us too!
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/fortuneTellers');
}

module.exports.renderEditForm = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user.role == 'customer') {
        app.pool.query("call query_customer(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            let thisUser
            for (let i = 0; i < results[0].length; i++) {
                if (results[0][i].Userid == id) {
                    thisUser = results[0][i];
                    break;
                }
            }
            ////////////////////NEW////////////////////
            const d = new Date(thisUser.BirthDate);
            d.setDate(d.getDate() + 1)
            const birthday = d.toISOString().substring(0, 10);
            ////////////////////NEW////////////////////
            res.render('users/customerEdit', { thisUser, birthday })
        });
    } else {
        app.pool.query("call query_provider(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            let thisUser
            for (let i = 0; i < results[0].length; i++) {
                if (results[0][i].Userid == id) {
                    thisUser = results[0][i];
                    break;
                }
            }
            ////////////////////NEW////////////////////
            const d = new Date(thisUser.BirthDate);
            d.setDate(d.getDate() + 1)
            const birthday = d.toISOString().substring(0, 10);
            ////////////////////NEW////////////////////
            res.render('users/providerEdit', { thisUser, birthday })
        });
    }
}

module.exports.showUser = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate('informationTypes').populate({
        path: 'informations',
        populate: {
            path: 'informationType'
        }
    });
    if (user.role == 'customer') {
        app.pool.query("call query_customer(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            let thisUser
            for (let i = 0; i < results[0].length; i++) {
                if (results[0][i].Userid == id) {
                    thisUser = results[0][i];
                    break;
                }
            }
            ////////////////////NEW////////////////////
            const d = new Date(thisUser.BirthDate);
            d.setDate(d.getDate() + 1)
            const birthday = d.toISOString().substring(0, 10);
            ////////////////////NEW////////////////////
            res.render('users/customerShow', { thisUser, user, birthday })
        });
    } else {
        app.pool.query("call query_provider(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            let thisUser
            for (let i = 0; i < results[0].length; i++) {
                if (results[0][i].Userid == id) {
                    thisUser = results[0][i];
                    break;
                }
            }
            ////////////////////NEW////////////////////
            const d = new Date(thisUser.BirthDate);
            d.setDate(d.getDate() + 1)
            const birthday = d.toISOString().substring(0, 10);
            ////////////////////NEW////////////////////
            res.render('users/providerShow', { thisUser, user, birthday })
        });
    }
}

module.exports.updateUser = async(req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user.role == 'customer') {
        app.pool.query("call query_customer(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            const thisUser = results[0][0]
            const { FirstName, LastName, PhoneNo, BirthDate, Address, CarRegNum, BloodGroup } = req.body;
            const sqlText = "call update_customer(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @output)";
            const sqlParams = [id, CarRegNum, BloodGroup, PhoneNo, FirstName, LastName, BirthDate, Address, thisUser.UserName, thisUser.Password];

            app.pool.query(sqlText, sqlParams, function(error, results, fields) {
                if (error) {
                    return next(error);
                }
                req.flash('success', 'profile updated!');
                res.redirect(`/users/${id}`);
            });
        });
    } else {
        app.pool.query("call query_provider(?)", [id], function(error, results, fields) {
            if (error) {
                return next(error);
            }
            const thisUser = results[0][0]
            const { FirstName, LastName, PhoneNo, BirthDate, Address, WorkExp } = req.body;
            const sqlText = "call update_provider(?, ?, ?, ?, ?, ?, ?, ?, ?, @output)";
            const sqlParams = [id, WorkExp, PhoneNo, FirstName, LastName, BirthDate, Address, thisUser.UserName, thisUser.Password];
            console.log('hello from update');
            app.pool.query(sqlText, sqlParams, function(error, results, fields) {
                if (error) {
                    return next(error);
                }
                req.flash('success', 'profile updated!');
                res.redirect(`/users/${id}`);
            });
        });
    }
}

module.exports.showSchedules = async(req, res) => {
    const id = req.params.id;
    ///////////////////////////POPULATION ADDED/////////////////
    const user = await User.findById(id).populate('informationTypes');
    ///////////////////////////POPULATION ADDED/////////////////
    if (user.role == 'customer') {
        app.pool.query("call query_appointment_customer(?)", [id], async function(error, results, fields) {
            if (error) return next(error);

            res.render('schedules/customerIndex', { results });
        });
    } else {
        app.pool.query("call query_appointment_provider(?)", [id], async function(error, results, fields) {
            if (error) return next(error);
            //////////////////////////////////////////////////////////
            const requireType = []
            for (let e of user.informationTypes) {
                requireType.push(e._id.toString());
            }
            const ansInfo = [];
            for (let e of results[0]) {
                const cid = e.CustomerId;
                const cus = await User.findById(cid).populate({
                    path: 'informations',
                    populate: {
                        path: 'informationType'
                    }
                })
                const thisCusInfo = []
                for (let f of cus.informations) {
                    if (requireType.includes(f.informationType._id.toString())) {
                        thisCusInfo.push({
                            value: f.value,
                            name: f.informationType.name
                        });
                    }
                }
                ansInfo.push(thisCusInfo);
            }
            //////////////////////////////////////////////////////////
            res.render('schedules/providerIndex', { results, ansInfo });
        });
    }
}