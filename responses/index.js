module.exports = function (req, res, next) {
    res.ok = function (data) {
        return res.status(200).json(data);
    };

    res.notFound = function (message) {
        return res.status(404).json({
            error: 'Not found',
            message: message || ""
        });
    };

    res.serverError = function (message) {
        return res.status(500).json({
            error: 'Server error',
            message: message || ""
        });
    };

    res.created = function (data) {
        return res.status(201).json(data);
    };

    res.noContent = function () {
        return res.status(204).end();
    };

    res.badParams = function (errors) {
        return res.status(400).json(errors);
    };

    return next();
};
