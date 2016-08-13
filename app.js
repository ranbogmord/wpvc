const express = require('express');
const bp = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const models = require('./models');
const morgan = require('morgan');

mongoose.connect(process.env.MONGO_URL);

app.use(bp.json());
app.use(require('./responses'));
app.use(morgan('combined'));

passport.use(new BasicStrategy(function (username, password, done) {
    models.User.findOne({
        $or: [{username: username}, {email: username}],
        deleted: false
    }, function (err, user) {
        if (err) return done('Failed to load user');
        if (!user) return done(null, false);

        user.validatePassword(password, function (err, result) {
            if (err) return done('Failed to validate password');
            if (!result) return done(null, false);

            return done(null, user);
        })
    });
}));

// API
const basicAuth = passport.authenticate('basic', {session: false});
const apiRouter = express.Router();
app.use('/api', apiRouter);
// Authenticated
apiRouter.use('/organizations', basicAuth, require('./controllers/organization'));
apiRouter.use('/sites', basicAuth, require('./controllers/site'));
apiRouter.use('/users', basicAuth, require('./controllers/user'));

// Unauthenticated
apiRouter.use('/checkins', require('./controllers/checkin'));
apiRouter.use('/auth', require('./controllers/auth'));


// App
app.get('/', function (req, res) {
    return res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
