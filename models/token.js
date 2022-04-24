const jsonwebtoken = require('jsonwebtoken')
const {Schema, model} = require('mongoose');
const moment = require('moment');
const config = require("../config.json");
const { ObjectId } = Schema.Types;


const tokenSchema = new Schema({
  jwt: { type: String, required: true },
  userId: { type: ObjectId, required: true },
  used: { type: Boolean, default: false },
  expires: { type: Date },
  type: { type: String },
});

const getExpDate = () => moment().add(1, "years");

tokenSchema.static('createToken', async function (userId) {
  const exp = getExpDate();

  const tokenOptions = {
    exp: exp.unix(),
    userId,
  };

  const jwt = jsonwebtoken.sign(tokenOptions, config.encryption.secret);
  const token = new this({
    jwt,
    userId,
    expires: exp,
  });
  await token.save();
  return token;
});

tokenSchema.static("verify", async function ( { jwt } ) {
  const token = await this.findOne({ jwt: jwt });
  if (!token || token.used || token.expires < moment().toDate()) {
    return { valid: false, reason: "Token Expired" };
  }
  try {
    const result = jsonwebtoken.verify(token.jwt, config.encryption.secret);
    return { valid: true, userId: token.userId };
  } catch (e) {
    return { valid: false, reason: e.toString() };
  }
});

tokenSchema.static("invalidate", async function ({ userId, jwt }) {
  if (jwt) {
    return this.findOneAndUpdate(
      { userId, jwt },
      { $set: { used: true } },
      { new: true }
    );
  } else {
    return this.updateMany({ userId }, { $set: { used: true } });
  }
});

const Token = model("token", tokenSchema);
module.exports = Token;
