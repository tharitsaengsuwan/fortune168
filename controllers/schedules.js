const app = require('../app.js');

module.exports.showSchedules = async(req, res, next) => {
    const id = req.params.id;
    if (currentUser.role == 'customer') {
        app.pool.query("call query_appointment_customer(?)", [id], function(error, results, fields) {
            if (error) return next(error);
            console.log(results);
            res.render('schedules/index', { results });
        });
    }
}