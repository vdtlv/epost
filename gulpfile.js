'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const typescript = require('gulp-typescript');
const del = require('del');
const nodemon = require('gulp-nodemon');


const tsClient = typescript.createProject('source/ts/client/tsconfig.json');
const tsServer = typescript.createProject('source/ts/server/tsconfig.json');

gulp.task('css', function () {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task('html', function () {
    return gulp.src('source/views/*.ejs')
      .pipe(gulp.dest('build/views'));
});

gulp.task('launchServer', function () {
  nodemon({
    script: 'build/index.js'
  })

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/ts/client/**/*.ts', gulp.series('client'));
  gulp.watch('source/ts/server/**/*.ts', gulp.series('server'));
  gulp.watch('source/views/*.ejs', gulp.series('html'));
});

gulp.task('client', function() {
    var tsResult = gulp.src('source/ts/client/**/*.ts')
        .pipe(tsClient());

    return tsResult.js.pipe(gulp.dest('build/js'));
});

gulp.task('server', function() {
    var tsResult = gulp.src('source/ts/server/**/*.ts')
        .pipe(tsServer());

    return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source//*.ico',
    'source/img/*.{img,png,svg}'
    ], {
      base: 'source'
    })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series('clean', 'copy', 'client', "server", 'css', 'html'));
gulp.task('start', gulp.series('build', 'launchServer'));
