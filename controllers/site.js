const models = require('../models');
const router = require('express').Router();

router
    .param('id', function (req, res, next, id) {
        models.Site.findOne({_id: id, deleted: false}, function (err, site) {
            if (err) return res.serverError('Failed to fetch site');
            if (!site) return res.notFound('Site not found');

            if (site.organization !== req.user.organization) {
                return res.forbidden();
            }

            req.site = site;
            next();
        });
    })
    .get('/', function (req, res) {
        models.Site.find({deleted: false, organization: req.user.organization}, function (err, sites) {
            if (err) return res.serverError('Failed to fetch sites');

            return res.ok(sites);
        });
    })
    .get('/:id', function (req, res) {
        return res.ok(req.site);
    })
    .post('/', function (req, res) {
        const site = new models.Site(req.body);
        site.organization = req.user.organization;

        site.save(function (err) {
            if (err) return res.badParams(err.errors);

            return res.created(site);
        });
    })
    .put('/:id', function (req, res) {
        const site = _.extend(req.site, req.body);
        site.organization = req.user.organization;

        site.save(function (err) {
            if (err) return res.badParams(err.errors);

            return res.ok(site);
        });
    })
    .delete('/:id', function (req, res) {
        const site = _.extend(req.site, {deleted: true});

        site.save(function (err) {
            if (err) return res.serverError('Failed to delete site');

            return res.noContent();
        });
    });


module.exports = router;