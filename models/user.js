const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    PhoneNo: {
        type: String,
        required: true
    },
    BirthDate: {
        type: Date,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

// this is going to add on username and password and some another method for us
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);