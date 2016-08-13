const router = require('express').Router();
const models = require('../models');
const passport = require('passport');

router
    .post('/register', function (req, res) {
        const org = new models.Organization(req.body.organization);
        const user = new models.User(req.body.user);

        org.save(function (orgError) {
            if (orgError) return res.badParams(orgError.errors);

            user.organization = org._id;

            user.save(function (userErr) {
                if (userErr) {
                    return org.remove(function (orgErr) {
                        if (orgErr) return res.serverError('Failed to register');

                        return res.badParams(userErr.errors);
                    });
                }

                return res.ok({
                    registered: true
                });
            });
        });
    });

module.exports = router;
