// Initialized modules
const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// File path variables
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js'
}

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'));
}

// JavaScript task
function jsTask() {
  return scr(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist'));
}

// Catchbusting task
const cbString = new Date().getTime();
function catchBustTask() {
  return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb='+cbString))
    .pipe(dest('.', 'cb='+cbString));
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask),
  catchBustTask,
  watchTask
);

// Watch task
function watchTask() {
  watch([files.scssPath, files.jsPath],
    parallel(scssTask, jsTask));
}

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask