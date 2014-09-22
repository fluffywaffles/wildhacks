'use strict';
// generated on 2014-06-27 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var fs   = require('fs');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.sass())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('migrate-php', function () {
  return gulp.src(['app/php/**/*.php', 'app/php/.htaccess'])
             .pipe(gulp.dest('dist/server'));
});

gulp.task('jade', function () {
  return gulp.src(['app/jade/**/*.jade', '!app/jade/orig.jade'])
             .pipe($.jade({
              pretty: true,
              locals: { 
               headlinesponsors: function() {
                var logos = fs.readdirSync('app/images/headlinesponsors').map(function(l) { return 'images/headlinesponsors/' + l; });
                console.log(logos);
                return logos.filter(function(l) { return fs.statSync('app/' + l).isFile(); });
              }(),
              sponsors: function() {
                var logos = fs.readdirSync('app/images/sponsors').map(function(l) { return 'images/sponsors/' + l; });
                console.log(logos);
                return logos.filter(function(l) { return fs.statSync('app/' + l).isFile(); });
              }(),
              inkindsponsors: function() {
                var logos = fs.readdirSync('app/images/inkindsponsors').map(function(l) { return 'images/inkindsponsors/' + l; });
                console.log(logos);
                return logos.filter(function(l) { return fs.statSync('app/' + l).isFile(); });
              }(),
              partners: function() {
                var logos = fs.readdirSync('app/images/partners').map(function(l) { return 'images/partners/' + l; });
                console.log(logos);
                return logos.filter(function(l) { return fs.statSync('app/' + l).isFile(); });
              }() }
             }))
             .pipe(gulp.dest('app'));
});

gulp.task('html', ['jade', 'styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
  
    gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*.*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('clear-the-fucking-cache', function() {
  // useful for when gulp:images decides to be a little shit
  $.cache.clearAll();
});

gulp.task('fonts', function () {
    return gulp.src('app/**/*.{eot,svg,ttf,woff}')
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.{html,php}'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'migrate-php', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect', 'styles'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        'app/jade/**/*.jade',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/jade/**/*.jade', ['jade']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
