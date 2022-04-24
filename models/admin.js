const jsonwebtoken = require('jsonwebtoken')
const {Schema, model} = require('mongoose');
const moment = require('moment');
const config = require("../config.json");

const {
    ObjectId
} = Schema.Types;

const adminSchema = new Schema({
    used: {
        type: Boolean,
        default: false},
    jwt: {
        type: String,
        required: true
    },
    expires: {
        type: Date
    },
}, { collection: 'admin' });

const getExpDate = () => moment().add(1, "years");

adminSchema.static('createToken', async function () {
    const exp = getExpDate();

    const tokenOptions = {
        exp: exp.unix()
    };

    const jwt = jsonwebtoken.sign(tokenOptions, config.encryption.secret);
    const token = new this({
        jwt,
        expires: exp,
    });
    await token.save();
    return token;
});

adminSchema.static("invalidate", async function () {
    return this.updateMany({}, {
        $set: {
            used: true
        }
    });
});

adminSchema.static("verify", async function (jwt) {
    const adminToken = await this.findOne({ jwt: jwt });
    if (!adminToken || adminToken.used || adminToken.expires < moment().toDate()) {
      return { valid: false, reason: "adminToken Expired" };
    }
    try {
      const result = jsonwebtoken.verify(adminToken.jwt, config.encryption.secret);
      return { valid: true };
    } catch (e) {
      return { valid: false, reason: e.toString() };
    }
  });  

const Admin = model('admin', adminSchema);
module.exports = Admin;