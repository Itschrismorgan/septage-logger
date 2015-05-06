var mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id: String, //vin to ensure uniqness 
    capacity: { type: Number, required: true },
    license: { type: String, required: true },
    nickname: { type: String, required: true },
    make: {type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: {type: String, require: true},
    companyId: {type: mongoose.Schema.Types.ObjectId },
});


module.exports = mongoose.model('Truck', schema);