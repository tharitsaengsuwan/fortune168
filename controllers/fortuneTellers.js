const app = require('../app.js');

module.exports.index = async(req, res, next) => {
    app.pool.query("call query_all_provider()", function(error, results, fields) {
        if (error) return next(error);
        console.log(results);
        res.render('fortuneTellers/index', { results });
    });
}

module.exports.makeAppointment = async(req, res) => {
    const customerId = currentUser._id.toString();
    const providerId = req.params.id;
    const { Date, Duration } = req.body;
    const sqlText = "call make_appointment(?, ?, ?, ?, ?, ?, ?)"
    const sqlParams = [customerId, providerId, 0, Date, Duration, "", ""];
    app.pool.query(sqlText, sqlParams, function(error, results, fields) {
        if (error) return next(error);
        console.log(results);
        req.flash('success', 'made an appointment!');
        res.redirect('/fortuneTellers');
    });
}

module.exports.showFortuneTeller = async(req, res, next) => {
    const id = req.params.id;
    app.pool.query("call query_provider(?)", [id], function(error, results, fields) {
        if (error) return next(error);
        res.render('fortuneTellers/show', { results });
    });
}