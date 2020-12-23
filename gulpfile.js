var gulp = require('gulp'),
    fs = require('fs-extra'),
    spawn = require('child_process').spawn,
    zip = require('gulp-zip'),
    psaux = require('psaux'),
    terminate = require('terminate');

gulp.task('server', function() {
    spawn('node', ['server.js'], {
        stdio: 'ignore',
        detached: true
    }).unref();
    return Promise.resolve();
});

gulp.task('stopserver', function() {
    return psaux().then(list => {
        list.filter(ps => {
            return ps.command.match(/server\.js/);
        }).map(ps => {
            terminate(ps.pid, (err) => {
                if (err) {
                    console.log("Terminate server fail: " + err);
                }
                else {
                    console.log('Terminate server done');
                }
            });
        });
    });
});

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
