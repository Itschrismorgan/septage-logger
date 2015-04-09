var mongoose = require('mongoose');

var accountTypes = "admin contractor driver".split(" ");

var schema = mongoose.Schema({
    _id: String, //username to ensure uniqness 
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    type: { type: String, required: true, enum: accountTypes },
    email: { type: String, required: true },
    active: { type: Boolean, required: true }
});


module.exports = mongoose.model('User', schema);