const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const logSchema = new Schema({
    "platNumber": {type: String},
    "DateTime": {type: Number},
    "userType": {type: String},
    "passingType": {type: String}
});

const Log = model('log', logSchema);
module.exports = Log;