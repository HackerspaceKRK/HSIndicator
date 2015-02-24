"use strict";

var gulp = require('gulp');
// Load plugins
var uglify = require("gulp-uglify");
var jshint = require('gulp-jshint');
var yuidoc = require("gulp-yuidoc");

gulp.task('uglify', function(){
  return gulp.src('lib/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest("./deploy"));
});


gulp.task('JSHint', function () {
  return gulp.src("lib/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('docs', ['JSHint'], function () {
  return gulp.src("lib/**/*.js")
    .pipe(yuidoc())
    .pipe(gulp.dest("docs"));
});


gulp.task('default', ['JSHint', 'uglify', 'docs']);
