const express = require('express');
const router = express.Router();
const Admin = require('../models/admin')
const {adminPassword} = require('../config.json')

router.post('/admin/login', async (req, res, next) => {

  const {password} = req.body
  if (password !== adminPassword) {
    return res.json({isAuth: false})
  }

  await Admin.invalidate();
  const adminToken = await Admin.createToken();
  console.log('adminToken', adminToken)
  // res.cookie('adminToken', adminToken.jwt, {httpOnly: true})
  res.json({isAuth: true, cookie: ['adminToken', adminToken.jwt]})

});

router.post('/admin/logout', async (req, res, next) => {

  await Admin.invalidate();
  res.json({isAuth: false})

});

router.get('/admin/checkAuth', async (req, res, next) => {

  
  const makeError = (reason = 'no token') => {
    console.error(reason)
    return res.json({isAuth: false})
  }
  
  const {adminToken} = req.cookies

  console.log('req.cookies >>> ', req.cookies)

  if (!adminToken) {
    return makeError()
  }

  const { valid, reason } = await Admin.verify(adminToken);

  if (!valid) {
    return makeError(reason)
  }

  res.json({isAuth: true})
});

module.exports = router;
