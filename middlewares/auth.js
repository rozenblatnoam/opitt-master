const Token = require('../models/token');
const getAppCookies = require('../lib/cookies');

async function hasSession(req, res, next) {
    const makeError = (reason = 'no token') => {
        console.error(reason)
        res.redirect('/auth1'); // the register page path of the app
    }

    if (!req.headers.cookie) {
        return makeError()
    }

    const { token } = getAppCookies(req);

    if (!token) {
        return makeError()
    }

    const { valid, userId, reason } = await Token.verify({jwt: token});
    
    if (!valid) {
        return makeError(reason)
    }

    req.userId = userId
    next();
  }

  module.exports = hasSession;
