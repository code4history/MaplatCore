var gulp = require('gulp'),
    fs = require('fs-extra'),
    zip = require('gulp-zip');

gulp.task('zip', function() {
    try {
        fs.removeSync('./distribution.zip');
    } catch (e) {
    }
    try {
        fs.removeSync('./distribution');
    } catch (e) {
    }
    try {
        fs.removeSync('./example.zip');
    } catch (e) {
    }
    try {
        fs.removeSync('./example');
    } catch (e) {
    }

    fs.ensureDirSync('./distribution');
    fs.copySync('./dist', './distribution/dist');
    fs.copySync('./parts', './distribution/parts');

    return new Promise(function(resolve, reject) {
        gulp.src(['./distribution/**/*'])
            .pipe(zip('distribution.zip'))
            .on('error', reject)
            .pipe(gulp.dest('./'))
            .on('end', resolve);
    }).then(function() {
        fs.moveSync('./distribution', './example');
        fs.copySync('./index.html', './example/index.html');
        fs.copySync('./apps', './example/apps');
        fs.copySync('./maps', './example/maps');
        fs.copySync('./pois', './example/pois');
        fs.copySync('./tiles', './example/tiles');
        return new Promise(function(resolve, reject) {
            gulp.src(['./example/**/*'])
                .pipe(zip('example.zip'))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        });
    }).then(function() {
        fs.removeSync('./example');
    });
});
