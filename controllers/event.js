const models = require('../models');
const router = require('express').Router();

router
    .get('/', function (req, res) {
        models.Event.find(function (err, events) {
            if (err) {
                return res.serverError('Failed to fetch events');
            }

            return res.ok(events);
        });
    })
    .get('/:id', function (req, res) {
        models.Event.findOne({_id: req.params.id}, function (err, event) {
            if (err) {
                return res.serverError('Failed to fetch event');
            }

            if (!event) {
                return res.notFound('Event not found');
            }

            return res.ok(event);
        });
    });

module.exports = router;
