const app = require('../app.js');
const User = require('../models/user')

module.exports.index = async(req, res, next) => {
    app.pool.query("call query_all_provider()", function(error, results, fields) {
        if (error) return next(error);
        res.render('fortuneTellers/index', { results });
    });
}

module.exports.makeAppointment = async(req, res, next) => {
    const customerId = req.user._id.toString();
    const providerId = req.params.id;
    const { Date, Duration } = req.body;
    const sqlText = "call make_appointment(?, ?, ?, ?, ?, ?, ?, @output)"
    const sqlParams = [customerId, providerId, 0, Date, Duration, 5, ""];
    app.pool.query(sqlText, sqlParams, function(error, results, fields) {
        if (error) return next(error);
        req.flash('success', 'made an appointment!');
        res.redirect('/fortuneTellers');
    });
}

module.exports.showFortuneTeller = async(req, res, next) => {
    const id = req.params.id;
    const ft = await User.findById(id).populate('informationTypes');
    app.pool.query("call query_provider(?)", [id], function(error, results, fields) {
        if (error) return next(error);
        let thisUser
        for (let i = 0; i < results[0].length; i++) {
            if (results[0][i].Userid == id) {
                thisUser = results[0][i];
                break;
            }
        }
        res.render('fortuneTellers/show', { thisUser, ft });
    });
}