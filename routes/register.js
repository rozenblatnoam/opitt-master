const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Token = require('../models/token')
const {ObjectId} = require('mongodb')
const PhoneVerification = require('../models/phoneVerification')
const twilio = require('twilio');

/**
 * createNewProperty
 * insertNewTenants
 * phoneVerificationReq
 * phoneVerificationCheck
 * getRegisterData
 * createNewPayment
 */

router.post('/createNewProperty', async function(req, res, next) {
  try {
    res.status(201).send('respond with a message that new property created')
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

router.post('/insertNewTenants', async function(req, res, next) {
  try {
    const newTenantsArr = req.body
    await User.insertMany(newTenantsArr)
    res.status(201).send('ok')
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

router.post('/phoneVerificationReq', async function(req, res, next) {
  try {
    const phone = req.body.phone
    const isExist = await User.findOne({ phone: phone})
    if (isExist === null) {
      return res.status(409).json({ error: 'user not found'})
    }

    // const code = Math.floor(Math.random() * 1000000).toString()
    // const expire = new Date().getTime() + 300000 // from now to 5 minutes
    // const newPhoneVerification = new PhoneVerification({phone, code, expire})
    // newPhoneVerification.save()

    // TODO: send sms with the code to this phone number...
    
    res.status(201).json({ status: 'ok' })
  } catch (e) {
    console.error(new Error(e))
    res.status(500).json({ error: e.toString() })
  }
})

router.post('/phoneVerificationCheck', async function(req, res, next) {
  try {
    const {phone, code} = req.body
    // const isExist = await PhoneVerification.findOne({phone, code})
    // if (isExist === null) {
    //   return res.status(404).json({ error: 'user not found'})
    // }
    // const {expire} = isExist
    // const now = new Date().getTime()
    // if (expire - now < 0) {
    //   return res.status(401).json({ error: 'auth code is expired'})
    // }
    // await PhoneVerification.deleteOne({_id: ObjectId(isExist._id).toString()})
    // create a token
    const user = await User.findOne({ phone: phone})
    await Token.invalidate({userId: user._id});
    const token = await Token.createToken(user._id);
    res.cookie('token', token.jwt, {httpOnly: true})
    const {role} = await User.findOne({ phone: phone})
    console.log(user, token, role)
    if (role === 'inRegistration') {
      return res.redirect('/register')
    } else {
      return res.redirect('/mainPageApp')
    }
  } catch (e) {
    console.error(new Error(e))
    res.status(500).json({ error: e.toString() })
  }
})

router.post('/getRegisterData', async function(req, res, next) {
  try {
    res.status(201).send('if verification secced the user will redirect the the relevant page with a token')
    // get the token from the request

    // fetch the relevant data from db and json it as a response
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

router.post('/createNewPayment', async function(req, res, next) {
  try {
    res.status(201).send('redirect the the home page if the pament secced')
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
})

module.exports = router;
