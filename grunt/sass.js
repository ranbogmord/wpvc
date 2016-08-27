module.exports = {
    options: {
        sourceMap: true
    },
    dev: {
        files: [{
            expand: true,
            cwd: 'public/src/scss',
            src: ['*.scss'],
            dest: 'public/dist/css',
            ext: '.css'
        }]
    }
};
