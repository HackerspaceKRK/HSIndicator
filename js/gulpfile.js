"use strict";

var gulp = require('gulp');
// Load plugins
var uglify = require("gulp-uglify");
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');

gulp.task('uglify', function(){
  return gulp.src('lib/**/*.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
         path.extname = ".min.js";
     }))
    .pipe(gulp.dest("./deploy"));
});


gulp.task('JSHint', function () {
  return gulp.src("lib/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy', function() {
  return gulp.src("lib/**/*.js")
  .pipe(gulp.dest("./deploy"));
});


gulp.task('default', ['JSHint', 'uglify', 'copy']);
