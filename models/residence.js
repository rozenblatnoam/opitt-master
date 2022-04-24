const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const residenceSchema = new Schema({
    platNumber: {type: String},
    propertyId: {type: ObjectId, ref: 'property'}
}, { collection: 'residence' });

const Residence = model('residence', residenceSchema);
module.exports = Residence;