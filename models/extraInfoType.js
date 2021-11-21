const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraInfoTypeSchema = new Schema({
    name: String,
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    informations: [{
        type: Schema.Types.ObjectId,
        ref: 'Information'
    }]
});

module.exports = mongoose.model("InformationType", extraInfoTypeSchema);