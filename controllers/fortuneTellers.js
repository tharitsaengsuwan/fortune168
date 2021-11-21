const app = require('../app.js');
const User = require('../models/user')
const Information = require('../models/extraInfo')
const InformationType = require('../models/extraInfoType')

module.exports.index = async(req, res, next) => {
    app.pool.query("call query_all_provider()", function(error, results, fields) {
        if (error) return next(error);
        res.render('fortuneTellers/index', { results });
    });
}

module.exports.makeAppointment = async(req, res, next) => {
    const customerId = req.user._id.toString();
    const providerId = req.params.id;
    const { Date, Duration, extrainfo } = req.body;
    const ft = await User.findById(providerId).populate('informationTypes');

    for (let i = 0; i < extrainfo.length; i++) {
        if (extrainfo[i]) {
            const newxtrainfo = new Information({ value: extrainfo[i] });
            newxtrainfo.owner = customerId;
            newxtrainfo.informationType = ft.informationTypes[i]._id;
            await newxtrainfo.save();

            const infotype = await InformationType.findById(ft.informationTypes[i]._id);
            infotype.informations.push(newxtrainfo._id);
            await infotype.save();

            const cus = await User.findById(customerId);
            cus.informations.push(newxtrainfo._id);
            await cus.save();
        }
    }
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