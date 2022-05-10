const express = require('express');
const router = express.Router();
const User = require('./../models/user')
const ObjectId = require('mongodb').ObjectID;

router.get('/guests', async function(req, res, next) {
  try {
 
    userId = req.userId
    const user = await User.findOne({_id: ObjectId(userId)})
    const allGuests = user.guests
    res.json(allGuests);
  } catch (e) {
    res.status(500).json({ error: e.toString() })
  }
});

router.post('/guests', async function(req, res, next) {
  try {
    userId = req.userId
    req.body.guest._id = new ObjectId()
    const confirmPush = await User.updateOne(
      {_id: ObjectId(userId)},
      {$push: {guests: req.body.guest}}
  )
      res.status(201).json(confirmPush);
  } catch (e) {
      res.status(500).json({ error: e.toString() })
  }
})

module.exports = router;
