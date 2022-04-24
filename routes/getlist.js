const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Residence = require('../models/residence')
const Guest = require('../models/guest')

// const hasSession = require('../middlewares/auth');

// router.use(hasSession);

router.get('/', async function(req, res, next) {
    res.redirect('/all')
})

router.get('/all', async function(req, res, next) {
    try {
        const propertyId = req.query.propertyId
        const guests = await Guest.find({propertyId: ObjectId(propertyId)}, {_id: 0, propertyId: 0})
        const residence = await Residence.find({propertyId: ObjectId(propertyId)}, {platNumber: 1, _id: 0})
        const all = guests.concat(residence);
        res.status(200).json(all);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.get('/residence', async function(req, res, next) {
    try {
        const propertyId = req.query.propertyId
        const residence = await Residence.find({propertyId: ObjectId(propertyId)}, {platNumber: 1, _id: 0})
        res.status(200).json(residence);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.get('/guests', async function(req, res, next) {
    try {
        const propertyId = req.query.propertyId
        const guests = await Guest.find({propertyId: ObjectId(propertyId)}, {_id: 0, propertyId: 0})
        res.status(200).json(guests);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

module.exports = router;
