const express = require('express');
const Gate = require('../models/gate');
const router = express.Router();
const Log = require('../models/log')
const ObjectId = require('mongodb').ObjectID;

// const hasSession = require('../middlewares/auth');

// router.use(hasSession);

router.put('/:gateId/status', async function(req, res, next) {
    try {
        const status = req.body
        const gateId = req.params.gateId
        await Gate.findOneAndUpdate(
            {_id: gateId},
            status
        )

        res.status(201).send('ok');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.post('/:gateId/log', async function(req, res, next) {
    try {
        const log = req.body
        await Log.insertMany(req.body)
        res.status(201).json(log);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

module.exports = router;
