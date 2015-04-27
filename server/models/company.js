var mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id: String, 
    name: { type: String, required: true },
    phone: { type: String, required: true },
    trucks: [
            {VIN: { type: String, required: true}, Nickname: { type: String, required: true }, Capacity: { type: Number, required: true}, }
        ],
    active: { type: Boolean, required: true }
});


module.exports = mongoose.model('Company', schema);