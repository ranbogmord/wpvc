const models = require('../models');
const router = require('express').Router();
const _ = require('lodash');

router
    .param('id', function (req, res, next, id) {
        models.User.findOne({_id: id, organization: req.user.organization, deleted: false}, function (err, user) {
            if (err) return res.serverError('Failed to fetch user');
            if (!user) return res.notFound('User not found');

            req.requestedUser = user;
            next();
        })
    })
    .get('/me', function (req, res) {
        return res.ok(req.user);
    })
    .post('/', function (req, res) {
        const user = new models.User(req.body);
        user.organization = req.user.organization;

        user.save(function (err) {
            if (err) return res.badParams(err.errors);

            return res.created(user);
        });
    })
    .get('/', function (req, res) {
        models.User.find({organization: req.user.organization, deleted: false}, function (err, users) {
            if (err) return res.serverError('Failed to fetch users');

            return res.ok(users);
        })
    })
    .get('/:id', function (req, res) {
        return res.ok(req.requestedUser);
    })
    .put('/:id', function (req, res) {
        const user = _.extend(req.requestedUser, req.body, {organization: req.requestedUser.organization});

        user.save(function (err) {
            if (err) return res.badParams(err.errors);

            return res.ok(user);
        })
    })
    .delete('/:id', function (req, res) {
        const user = _.extend(req.requestedUser, {deleted: true});

        user.save(function (err) {
            if (err) return res.serverError('Failed to delete user');

            return res.noContent();
        });
    })

module.exports = router;
