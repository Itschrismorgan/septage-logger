var mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id: String, //vin to ensure uniqness 
    capacity: { type: Number, required: false },
    license: { type: String, required: false },
    nickname: { type: String, required: false },
    make: {type: String, required: false },
    model: { type: String, required: false },
    year: { type: Number, required: false },
    color: {type: String, required: false},
    stat: {type: String, required: false},
    companyId: {type: mongoose.Schema.Types.ObjectId },
    approvedDrivers: [{type: String}]
});


module.exports = mongoose.model('Truck', schema);