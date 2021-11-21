const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraInfoSchema = new Schema({
    value: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    informationType: {
        type: Schema.Types.ObjectId,
        ref: 'InformationType'
    }
});

module.exports = mongoose.model('Information', extraInfoSchema);