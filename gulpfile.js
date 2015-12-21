"use strict";

var      gulp = require('gulp'),
       concat = require('gulp-concat'),
       uglify = require('gulp-uglify'),
       rename = require('gulp-rename'),
         sass = require('gulp-sass'),
         maps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync').create(),
          del = require('del'),
    minifyCss = require('gulp-minify-css'),
 autoprefixer = require('gulp-autoprefixer');

 gulp.task("concatScripts", function() {
    return gulp.src([
        'js/functionOne.js',
        'js/functionTwo.js',
        'js/main.js'
        ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

 gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

 gulp.task('compileSass', function() {
  return gulp.src("scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
      .pipe(minifyCss())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream());
});

 gulp.task('watchFiles', function() {

  browserSync.init({
        server: {
            baseDir: "./"
        }
    });
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch('scss/**/*.scss', ['compileSass']);
  gulp.watch('bower_components/*.scss', ['compileSass']);
  gulp.watch('js/*.js', ['minifyScripts']);
})

gulp.task('clean', function() {
  return del(['dist', 'css/application.css*', 'js/app.*.js*']);
});

gulp.task("build", ['minifyScripts', 'compileSass'], function() {
  return gulp.src(["css/application.css", "js/app.min.js", "index.html", "img/**", "bower_components/**"], { base: './' })
          .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

 gulp.task('default', ['clean'], function(){
  gulp.start('build');
});