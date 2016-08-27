require('dotenv').config();
const app = require('./app');
const grunt = require('grunt');
require('./Gruntfile')(grunt);

grunt.tasks(['build'], {}, function (err) {
    console.log(err || 'Assets built');
});

app.listen(process.env.PORT, function () {
    console.log('App running on port', process.env.PORT);
});
