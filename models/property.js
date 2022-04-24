const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema({
    _id: {type: ObjectId},
    tenantId: {type: Schema.Types.ObjectId, ref: 'User'},
    guestId: {type: Schema.Types.ObjectId, ref: 'User'},
    start: {type: Number},
    end: {type: Number},
    fulfilled: {type: Boolean, default: false}
})

const propertySchema = new Schema({
    address: {type: String}, // needs to be a nested object
    tenants: [{type: Schema.Types.ObjectId, ref: 'User'}],  // ROLE SHOULD BE ADDED! the role should be an item from the enum
    requests: { type: [requestSchema]}
});

const Property = model('property', propertySchema);
module.exports = Property;
