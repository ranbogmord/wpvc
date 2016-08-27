var babel = require('rollup-plugin-babel');

module.exports = {
    options: {
        plugins: function () {
            return [
                babel({
                    exclude: '../node_modules/**'
                })
            ];
        },
        format: 'iife'
    },
    dev: {
        src: 'public/src/js/main.js',
        dest: 'public/dist/js/bundle.js'
    }
};
