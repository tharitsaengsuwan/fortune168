const InformationType = require('../models/extraInfoType');
const User = require('../models/user');
const Information = require('../models/extraInfo');

module.exports.renderEditForm = async(req, res) => {
    const { id, infoid } = req.params;
    const extrainfo = await Information.findById(infoid).populate('informationType');
    res.render('extrainfo/edit', { id, extrainfo });
}

module.exports.editInfo = async(req, res) => {
    const { id, infoid } = req.params;
    const { value } = req.body;
    await Information.findByIdAndUpdate(infoid, { value })

    req.flash('success', 'Successfully updated an extra information!')
    res.redirect(`/users/${id}`);
}

module.exports.deleteInfo = async(req, res) => {
    const { id, infoid } = req.params;
    const info = await Information.findById(infoid).populate('informationType')
    await InformationType.findByIdAndUpdate(info.informationType._id, { $pull: { informations: infoid } })
    await Information.findByIdAndDelete(infoid);

    req.flash('success', 'Successfully deleted an extra information!')
    res.redirect(`/users/${id}`);
}