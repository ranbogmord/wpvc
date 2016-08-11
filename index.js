require('dotenv').config();
const app = require('./app');



app.listen(process.env.PORT, function () {
    console.log('App running on port', process.env.PORT);
});
