const rest = require('restler');
const url = "https://wpvulndb.com/api/v2";

module.exports = rest.service(function () {

}, {

}, {
    checkWordpressVersion: function (version) {
        return this.get(url + '/wordpresses/' + version);
    },
    checkPlugin: function (slug) {
        return this.get(url + '/plugins/' + slug);
    }
});
