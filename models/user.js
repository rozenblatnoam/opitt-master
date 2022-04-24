const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const GuestSchema = new Schema({
    _id: {type: ObjectId},
    fullName: {type: String},
    plateNumber: {type: String},
    manufacturer: {type: String}
})

const ReservedSchema = new Schema({
    _id: {type: ObjectId},
    parkingId: {type: Schema.Types.ObjectId, ref: 'parking'},
    propertyId: {type: Schema.Types.ObjectId, ref: 'property'},
    start: {type: Number},
    end: {type: Number},
    guestId: {type: Schema.Types.ObjectId, ref: 'user'},
    created: { type: Number},
    sorce: {type: String},
    sorceId: {type: ObjectId}
})

const userSchema = new Schema({
    fname: {type: String},
    lname: {type: String},
    phone: {type: String, unique: true},
    properties: [{type: Schema.Types.ObjectId, ref: 'property'}],
    parking: [{type: Schema.Types.ObjectId, ref: 'parking'}],
    role: {type: String}, // NEED TO BE FROM ENUM
    reserved: [ReservedSchema],
    guests: [GuestSchema]
});

const User = model('user', userSchema);
module.exports = User;