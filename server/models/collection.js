/**
 * Created by chrismorgan on 5/18/15.
 */
var mongoose = require('mongoose');

var locationTypes = "business residential".split(" ");

var schema = mongoose.Schema({
    companyId: {type: String, required: true },
    driverId: {type: String, required: true },
    createdTimeStamp: { type: Date, default: Date.now },
    editedTimeStamp: { type: Date, required: false},
    location: {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        address: {type: String, required: true}
    },
    type: {type: String, required: true},
    locationType: { type: String, required: true,  enum: locationTypes },
    truckId: {type: String, required: true },
    treatmentSiteId: {type: String },
    volume: {type: Number, required: true},
    dischargeLocation: {
        latitude: {type: Number, required: false},
        longitute: {type: Number, required: false},
        address: {type: String, required: false}
    },
    dischargeTimeStamp: { type: Date, required: false }
});


module.exports = mongoose.model('Collection', schema);
