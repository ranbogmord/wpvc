const router = require('express').Router();
const models = require('../models');
const mongoose = require('mongoose');
const _ = require('lodash');

router
    .param('id', function (req, res, next, id) {
        models.Organization.findOne({_id: id, deleted: false}, function (err, org) {
            if (err) { return res.serverError('Failed to fetch organization'); }

            if (!org) { return res.notFound('Organization not found'); }

            req.organization = org;
            next();
        });
    })
    .get('/', function (req, res) {
        models.Organization.find({deleted: false}, function (err, orgs) {
            if (err) return res.serverError('Failed to fetch organizations');

            return res.ok(orgs);
        });
    })
    .get('/:id', function (req, res) {
        return res.ok(req.organization);
    })
    .post('/', function (req, res) {
        let org = new models.Organization(req.body);

        org.save(function (err) {
            if (err) { return res.badParams(err.errors); }

            return res.created(org);
        });
    })
    .put('/:id', function (req, res) {
        const org = _.extend(req.organization, req.body);

        org.save(function (err) {
            if (err) return res.badParams(err.errors);

            return res.ok(org);
        });
    })
    .delete('/:id', function (req, res) {
        const org = _.extend(req.organization, {deleted: true});

        org.save(function (err) {
            if (err) return res.serverError('Failed to delete organization');

            return res.noContent();
        });
    });

module.exports = router;
