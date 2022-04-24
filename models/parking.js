const mongoose = require('mongoose');
const { Schema, model, ObjectId } = mongoose;
// const Property = require('./../models/property').schema
// const User = require('./../models/user').schema

const offerSchema = new Schema({
    _id: {type: ObjectId},
    start: {type: Number},
    end: {type: Number},
    weekly: {type: Boolean, default: false},
    reserved: {type: Boolean, default: false}
})

const parkingSchema = new Schema({
    propertyId: {type: ObjectId, ref: 'Property'},
    ownerId: {type: ObjectId, ref: 'User'},
    number: {type: String},
    floor: {type: String},
    offered: {type: [offerSchema]}
}, { collection: 'parking' });

const Parking = model('parking', parkingSchema);
module.exports = Parking;
