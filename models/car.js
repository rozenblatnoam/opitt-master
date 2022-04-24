const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const carSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'user'},
    plate: {type: String},
    manufacturer: {type: String}, // needs to selected from 3th party API
});

const Car = model('car', carSchema);
module.exports = Car;