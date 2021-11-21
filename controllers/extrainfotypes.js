const InformationType = require('../models/extraInfoType');
const User = require('../models/user');
const Information = require('../models/extraInfo')

module.exports.renderNewForm = async(req, res) => {
    const id = req.params.id;
    res.render('extrainfotypes/new', { id });
}

module.exports.renderEditForm = async(req, res) => {
    const { id, typeid } = req.params;
    const infotype = await InformationType.findById(typeid);
    res.render('extrainfotypes/edit', { id, infotype });
}

module.exports.createNewType = async(req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    const infotype = new InformationType({ name, description });
    infotype.owner = req.user._id;
    await infotype.save();

    const owneruser = await User.findById(id);
    owneruser.informationTypes.push(infotype);
    await owneruser.save();

    req.flash('success', 'Successfully created a new extra information type!')
    res.redirect(`/users/${id}`);
}

module.exports.editType = async(req, res) => {
    const { id, typeid } = req.params;
    const { name, description } = req.body;
    await InformationType.findByIdAndUpdate(typeid, { name, description })

    req.flash('success', 'Successfully updated an extra information type!')
    res.redirect(`/users/${id}`);
}

module.exports.deleteType = async(req, res) => {
    const { id, typeid } = req.params;
    const thisType = await InformationType.findById(typeid);
    await Information.deleteMany({ _id: { $in: thisType.informations } })
    await User.findByIdAndUpdate(id, { $pull: { informationTypes: typeid } })
    await InformationType.findByIdAndDelete(typeid)

    req.flash('success', 'Successfully deleted an extra information type!')
    res.redirect(`/users/${id}`);
}