module.exports = {
    js: {
        files: ['public/src/js/**/*.js'],
        tasks: ['newer:rollup']
    },
    styles: {
        files: ['public/src/scss/**/*.scss'],
        tasks: ['newer:sass:dev']
    }
};
