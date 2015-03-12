'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  clean = require('gulp-clean'),
  merge2 = require('merge2'),
  should = require('should'),
  ngTemplate = require('./index'),
  gulpSequence = require('gulp-sequence');

gulp.task('jshint', function () {
  return gulp.src(['*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function () {
  return gulp.src(['test/templates.js', 'test/templates.html'])
    .pipe(clean({force: true}));
});

gulp.task('ngTemplate()', function () {
  return gulp.src(['test/a.html', 'test/b.html'])
    .pipe(ngTemplate({moduleName: 'testModule', standalone: true}))
    .pipe(gulp.dest('test'));
});

gulp.task('test', gulpSequence(
  'clean',
  'ngTemplate()'
  //'clean'
));

gulp.task('default', gulpSequence('jshint', 'test'));