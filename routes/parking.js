const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Property = require('./../models/property')
const Parking = require('./../models/parking')
const User = require('./../models/user')

const hasSession = require('../middlewares/auth');

router.use(hasSession);

router.get('/requests', async function(req, res, next) {
    try {
        const doc = await Property.findById(req.query.propertyId).orFail(() => new Error("property not found"));
         // Get requests that start only from now on
        onlyRelevantRequests = doc.requests.filter(request => request.start > new Date().valueOf())
        res.status(200).json(onlyRelevantRequests);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.get('/offered', async function(req, res, next) {
    try {
        const propertyId = req.query.propertyId;
        const nowPlusTenMinutes = new Date().valueOf() + 600000

        const allPropertyParking = await Parking.aggregate([
            {$match: {"propertyId": ObjectId(propertyId)}},
            {$lookup: {
                "from": "users",
                "localField": "ownerId",
                "foreignField": "_id",
                "as": "owner"
            }},
            {$project:{
                _id: 0,
                number: 1,
                floor: 1,
                ownerLname:'$owner.lname',
                parkingId: "$_id",
                offered: {
                    $filter: {
                        input: "$offered", 
                        as: "offer", 
                        cond: {
                            $and: [
                                {$or: [
                                    // Show only offers that are left in them 10 minutes from now
                                    {$gte: ["$$offer.end", nowPlusTenMinutes]},
                                    {$eq: ["$$offer.weekly", true]}
                                ]},
                                {$eq: ["$$offer.reserved", false]}
                            ]
                        }
                    }
                }
            }},
            {$unwind : "$offered"},
            {$replaceWith: {
                $mergeObjects: [
                    {
                        "number": "$number", 
                        "floor": "$floor", 
                        "ownerLname": "$ownerLname", 
                        "parkingId": "$parkingId"
                    }, "$offered" 
                ]
            }},
            {$unwind: "$ownerLname"}
        ])
        const fixDates = allPropertyParking.map($ => { 
            const now = new Date().valueOf()
            let range = now - $.start
            let weeksPass = range / 604800000 // week in ms
            $.start = $.start + (604800000 * Math.ceil(weeksPass) )
            $.end = $.end + (604800000 * Math.ceil(weeksPass) )
            return $
        })
        res.status(200).json(fixDates);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.get('/reserved', async function(req, res, next) {
    try {
        const propertyId = req.query.propertyId;
        userId = req.userId
        const allUserReserved = await User.find({_id:ObjectId(userId)}).populate({
            path: 'reserved.parkingId',
            model: 'parking',
            select: 'number floar propertyId owner',
            populate: {
                path: 'owner',
                model: 'user',
                select: 'lname'
            }
        })
        const justPropertyParking = allUserReserved[0].reserved.filter($ => $.propertyId ? $.propertyId.toString() === propertyId : 'undefined')

        res.status(200).json(justPropertyParking);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.post('/requests', async function(req, res, next) {
    try {
        userId = req.userId
        const newRequest = {
            _id: new ObjectId(),
            tenantId: userId,
            guestId: req.body.guestId,
            start: req.body.start,
            end: req.body.end,
        }
        await Property.updateOne(
            {_id: ObjectId(req.body.propertyId)},
            { $push: {requests: newRequest } }
        )
        res.status(201).json('request created');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.post('/offered', async function(req, res, next) {
    try {
        const newOffer = {
            _id: new ObjectId(),
            start: req.body.start,
            end: req.body.end,
            weekly: req.body.weekly,
        }
        await Parking.updateOne(
            {_id: ObjectId(req.body.parkingId)},
            { $push: {offered: newOffer } }
        )
        res.status(201).json('offer created');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.post('/confirm', async function(req, res, next) { // maybe its should be reserved in post request union with the pick route
    try {
        userId = req.userId
        const {propertyId, parkingId, requestId} = req.body
        let theRequestArr = []
        const doc = await Property.findById(propertyId).orFail(() => new Error("property not found"));
        const requests = doc.requests
        theRequestArr = requests.filter($ => $._id.toString() === requestId) // catch the request details
        await Property.findOneAndUpdate(
            { _id: propertyId, "requests._id": requestId },
            {$set: {"requests.$.fulfilled": true}}
        )
        if (theRequestArr.length > 0) {
            const theRequest = theRequestArr[0]
            const newReserved = {
                _id: ObjectId(),
                start: theRequest.start,
                end: theRequest.end,
                parkingId: parkingId,
                propertyId: propertyId,
                guestId: theRequest.guestId,
                sorce: 'request',
                sorceId: theRequest._id
            }
            await User.updateOne(
                {_id: theRequest.tenantId},
                { $push: {reserved: newReserved } }
            )
            res.status(201).json('request confirmed');
        } else {
            return res.status(404).json({ error: `could not find request ${requestId}` });
        }
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.post('/pick/', async function(req, res, next) { // maybe its should be reserved in post request union with the pick route
    try {
        userId = req.userId
        let guestId
        if (req.query.guest === 'new') {
            guestId = req.body.guest._id = new ObjectId()
            await User.updateOne(
            {_id: ObjectId(userId)},
            {$push: {guests: req.body.guest}}
            )
        } else {
            guestId = req.body.guestId
        }
        const thePraking = await Parking.findOneAndUpdate(
            {_id: req.body.parkingId, offered: {$elemMatch: {_id: req.body.offerId}}},
            {$set: {'offered.$.reserved': true}},
            {projection: { "number" : 1, "owner" : 1, "floor" : 1 , "offered": 1}},
        )
        const newOffered = thePraking.offered.filter($ => $._id.toString() === req.body.offerId)
        reservedObject = new Object()
        reservedObject._id = ObjectId()
        reservedObject.parkingId = thePraking._id
        reservedObject.propertyId = req.body.propertyId
        reservedObject.start = newOffered[0].start
        reservedObject.end = newOffered[0].end
        reservedObject.guestId = guestId
        reservedObject.sorce = 'offer'
        reservedObject.sorceId = newOffered[0]._id
        
        await User.updateOne(
            {_id: ObjectId(userId)},
            { $push: {reserved: reservedObject } }
        )


        res.status(201).json('offer been picked');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.delete('/requests/:requests_id', async function(req, res, next) {
    try {
        const requests_id = req.params.requests_id
        const property_id = req.query.property
        await Property.updateOne(
            {_id: ObjectId(property_id)},
            {$pull: {requests: {_id: ObjectId(requests_id)}}}
        )
        res.status(202).json('request deleted');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.delete('/offered/:offered_id', async function(req, res, next) {
    try {
        const offered_id = req.params.offered_id
        const parking_id = req.query.parking
        const confirm = await Parking.updateOne( {_id: ObjectId(parking_id)}, { $pull: {offered: {_id: ObjectId(offered_id)} } } )
        res.status(202).json(confirm);
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

router.delete('/reserved/:reserved_id', async function(req, res, next) {
    try {
        const reserved_id = req.params.reserved_id
        userId = req.userId
        const doc = await User.findOneAndUpdate(
            {_id: ObjectId(userId)},
            {$pull: {reserved: {_id: ObjectId(reserved_id)}}},
            {"fields": { "reserved": {$elemMatch: {_id: ObjectId(reserved_id)}}}}
        )
        const {parkingId, sorce, sorceId} = doc.reserved[0]
        switch (sorce) {
            case 'offer':
                await Parking.findOneAndUpdate(
                    {_id: parkingId, offered: {$elemMatch: {_id: sorceId}}},
                    {$set: {'offered.$.reserved': false}}
                )
                break;
        }
        res.status(202).json('reserved deleted');
    } catch (e) {
        res.status(500).json({ error: e.toString() })
    }
})

module.exports = router;
