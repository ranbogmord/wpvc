const express = require('express');
const bp = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

app.use(bp.json());
app.use(require('./responses'));


app.use('/organizations', require('./controllers/organization'));
app.use('/sites', require('./controllers/site'));
app.use('/checkins', require('./controllers/checkin'));

module.exports = app;
