const models = require('../models');
const router = require('express').Router();
const _ = require('lodash');

router
    .param('token', function (req, res, next, token) {
        models.Site.findOne({token: token}, function (err, site) {
            if (err) return res.serverError('Failed to fetch site');
            if (!site) return res.badParams({token: {message: 'Invalid token'}});

            req.site = site;
            next();
        })
    })
    .post('/:token', function (req, res) {
        const checkin = new models.Checkin(_.extend(req.body, {site: req.site._id}));

        checkin.save(function (err) {
            if (err) return res.badParams(err.errors);

            req.site.coreVersion = checkin.coreVersion;
            req.site.plugins = checkin.plugins;
            req.site.lastCheckin = checkin.timestamp;

            req.site.save(function (err) {
                if (err) return res.badParams(err.errors);

                return res.ok(checkin);
            });
        });
    });

module.exports = router;
