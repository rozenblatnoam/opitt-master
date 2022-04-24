const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const gateSchema = new Schema({
    electricity: {type: String},
    engine: {type: String},
    communication: {type: String},
    battery: {type: String},
    lprIn: {type: String},
    lprOut: {type: String},
    pollCamera: {type: String},
    viewfinder: {type: String},
    boundaryBreakerOpening: {type: String},
    boundaryBreakerClosing: {type: String},
    roadDetector: {type: String},
    dryTouch: {type: String},
    systemTest:{type: String}
});

const Gate = model('gate', gateSchema);
module.exports = Gate;