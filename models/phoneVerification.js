const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const phoneVerificationSchema = new Schema({
    phone: {type: String},
    code: {type: String},
    expire: {type: String} // ??
});

const PhoneVerification = model('PhoneVerification', phoneVerificationSchema);
module.exports = PhoneVerification;
