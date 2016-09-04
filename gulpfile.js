var gulp = require("gulp"),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat'),
    del = require('del');

var env,
    jsSources,
    cssSources,
    htmlSources,
    outputDir,
    imgSources,
    minExtension;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir = 'builds/development/';
    minExtension = '';
} else {
    outputDir = 'dist/';
    minExtension = '.min'
}

jsSources = [
    'app/scripts/main.js',
    'app/scripts/services/*.js',
    'app/scripts/directives/*.js',
    'app/scripts/controllers/*.js'
];

cssSources = [
    'app/styles/css/*.css'
];

htmlSources = ['app/html/*.html'];
imgSources = ['app/img/**'];

thirdPartyJSSources = [
    'node_modules/jquery/dist/jquery'+ minExtension +'.js',
    'node_modules/angular/angular'+ minExtension +'.js',
    'node_modules/angular-ui-router/release/angular-ui-router'+ minExtension +'.js',
    'node_modules/bootstrap/dist/js/bootstrap'+ minExtension +'.js',
    'node_modules/sweetalert2/dist/sweetalert2' + minExtension +'.js',
];
thirdPartyCSSSources = [
    'node_modules/bootstrap/dist/css/bootstrap'+ minExtension +'.css',
    'node_modules/font-awesome/css/font-awesome'+ minExtension +'.css',
    'node_modules/sweetalert2/dist/sweetalert2' + minExtension +'.css',
];
fontSources = [
    'node_modules/bootstrap/fonts/**',
    'node_modules/font-awesome/fonts/**',

];
gulp.task('html', function() {
    return gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulp.dest(outputDir + 'html'))
        .pipe(connect.reload())
});

gulp.task('js', function() {
    return gulp.src(jsSources)
        .pipe(concat('imatroll.js'))
        // .pipe(gulpif(env === 'production', uglify()))  //can't uglify this unless we fix all ';'
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    return gulp.src(cssSources)
        .pipe(concat('imatroll.css'))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('vendorjs', function() {
    return gulp.src(thirdPartyJSSources)
        .pipe(concat('vendor.js'))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('vendorcss', function() {
    return gulp.src(thirdPartyCSSSources)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('fonts', function() {
    return gulp.src(fontSources)
        .pipe(gulp.dest(outputDir + 'fonts'))
        .pipe(connect.reload())
});

gulp.task('img', function() {
    return gulp.src(imgSources)
        .pipe(gulp.dest(outputDir + 'img'))
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        port: 26000,
        root: 'builds/development',
        livereload: true
    });
});

gulp.task('vendor', ['vendorjs', 'fonts', 'vendorcss', 'img']);
gulp.task('imatroll', ['html', 'js', 'css']);

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(cssSources, ['css']);
});

gulp.task('clean', function() {
    return del(['builds/']);
});

//this is the original default task
gulp.task('dev', ['connect', 'vendor', 'imatroll', 'watch']);


//the watch task is removed so gulp is terminated afer all taskes, this is for production mode
gulp.task('default', ['vendor', 'imatroll']);