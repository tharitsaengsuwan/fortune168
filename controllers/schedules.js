const app = require('../app.js');
const User = require('../models/user');
const DateTime = require('datetime-converter-nodejs');

module.exports.deleteAppointment = async(req, res, next) => {
    const { ScheduleId, CustomerId, ProviderId } = req.body;
    const id = req.user._id.toString();
    const user = await User.findById(id);
    const role = user.role;
    if ((role == 'customer' && CustomerId == id) || (role == 'fortuneTeller' && ProviderId == id)) {
        const sqlText = "call delete_appointment(?, ?, ?)";
        const sqlParams = [ScheduleId, CustomerId, ProviderId];
        app.pool.query(sqlText, sqlParams, function(error, results, fields) {
            if (error) return next(error);
            req.flash('success', 'appointment deleted!');
            res.redirect(`/users/schedules/${id}`);
        });
    } else {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/fortuneTellers');
    }
}

module.exports.updateAppointment = async(req, res, next) => {
    const { ScheduleId, CustomerId, ProviderId, DateT, Duration, newStatus } = req.body;
    const newDate = new Date(DateT.substring(0, 24));
    const id = req.user._id.toString();
    const user = await User.findById(id);
    const role = user.role;
    if (role == 'fortuneTeller' && ProviderId == id) {
        const sqlText = "call update_appointment(?, ?, ?, ?, ?, ?, ?, ?, @output)";
        const sqlParams = [ScheduleId, CustomerId, ProviderId, newStatus, newDate, Duration, 5, ""];
        app.pool.query(sqlText, sqlParams, function(error, results, fields) {
            if (error) return next(error);
            req.flash('success', 'appointment updated!');
            res.redirect(`/users/schedules/${id}`);
        });
    } else {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/fortuneTellers');
    }
}