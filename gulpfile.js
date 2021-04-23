"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var typescript = require("gulp-typescript");
var del = require("del");
var nodemon = require('gulp-nodemon');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
});

gulp.task("html", function () {
    return gulp.src("source/views/*.ejs")
      .pipe(gulp.dest("build/views"));
});

gulp.task("server", function () {
  nodemon({
    script: "index.js"
  })

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/ts/**/*.ts", gulp.series("js"));
  gulp.watch("source/views/*.ejs", gulp.series("html"));
});


gulp.task ("js", function () {
  return gulp.src("source/ts/**/*.ts")
    .pipe(typescript({
      target: "ES6",
      module: "ES2015",
      moduleResolution: "node"
    }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source//*.ico",
    "source/img/*.{img,png,svg}"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "js", "css", "html"));
gulp.task("start", gulp.series("build", "server"));
