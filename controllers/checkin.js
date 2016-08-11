const models = require('../models');
const router = require('express').Router();
const _ = require('lodash');
const async = require('async');
const WPvulnDB = require('../lib/wpvulndb');
const semcmp = require('semver-compare');

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

            req.site.coreVersion = checkin.coreVersion || req.site.coreVersion;
            req.site.plugins = checkin.plugins || req.site.plugins;
            req.site.lastCheckin = checkin.timestamp;

            const client = new WPvulnDB();

            const checks = [function (callback) {
                client.checkWordpressVersion(req.site.coreVersion.replace(/\./g, '')).on('complete', function (result) {
                    callback(null, {
                        type: 'wordpress',
                        result: result
                    });
                });
            }].concat(req.site.plugins.map(function (plugin) {
                return function (callback) {
                    client.checkPlugin(plugin.slug).on('complete', function (result) {
                        callback(null, {
                            type: 'plugin',
                            installedVersion: plugin.version,
                            slug: plugin.slug,
                            result: result
                        });
                    });
                };
            }));

            async.parallel(checks, function (err, results) {
                if (!err) {
                    results.forEach(function (response) {
                        if (response instanceof Error) {
                            return false;
                        }

                        if (response.type == 'wordpress') {
                            if (response.result[req.site.coreVersion]) {
                                req.site.knownVulnerabilities.wordpress = response.result[req.site.coreVersion].vulnerabilities;
                            }

                        } else if (response.type == 'plugin') {
                            if (response.result[response.slug]) {
                                let vulns = response.result[response.slug].vulnerabilities;

                                let affectedVulns = [];
                                vulns.forEach(function (vuln) {
                                    if (!vuln.fixed_in || semcmp(vuln.fixed_in, response.installedVersion) > 0) {
                                        affectedVulns.push(vuln);
                                    }
                                });

                                req.site.knownVulnerabilities.plugins = affectedVulns;
                            }
                        }
                    });
                }

                req.site.save(function (err) {
                    if (err) return res.badParams(err.errors);

                    return res.ok(checkin);
                });
            });
        });
    });

module.exports = router;
