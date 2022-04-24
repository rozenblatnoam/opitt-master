const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const guestSchema = new Schema({
    platNumber: {type: String},
    entryDateTime: {type: Number},
    ExitDateTime: {type: Number},
    propertyId: {type: ObjectId, ref: 'property'}
});

const Guest = model('guest', guestSchema);
module.exports = Guest;
