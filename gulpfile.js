(()=>{
  'use strict';
  const gulp = require('gulp'),
        gutil = require('gulp-util'),
        inject = require('gulp-inject'),
        ngfilesort = require('gulp-angular-filesort'),
        environments = require('gulp-environments'),
        transform = require('gulp-transform'),
        concat = require('gulp-concat'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        ngmin = require('gulp-ngmin'),
        ngAnnotate = require('gulp-ng-annotate'),
        del = require('del'),
        js = ['./public/app/**/**/*.module.js',
             './public/app/**/**/*.controller.js',
             './public/app/**/**/*.service.js'];


  gulp.task('clean', ['dist'], ()=>{
      return del(["./public/build"]);
  });

  gulp.task('dist', ()=>{
      return gulp.src(['./public/app/**/**/*.module.js',
                    './public/app/**/**/*.controller.js',
                    './public/app/**/**/*.service.js'])
              .pipe(concat('./public/build/concat.js'))
              .pipe(rename('./src.min.js'))
              .pipe(gulp.dest('./public/dist'));
  });

  gulp.task('inject-files', ['dist'], ()=>{
    let target = gulp.src('./index.html'),
        sources = gulp.src(['./public/dist/*.js']);

       return target.pipe(inject(sources)).pipe(gulp.dest('./'));
  });

  gulp.task('inject-dev', ()=>{
    let target = gulp.src('./index.html'),
        sources = gulp.src(js);
    return target.pipe(inject(sources)).pipe(gulp.dest('./'));
  });

  gulp.task('production', ['dist', 'inject-files', 'clean']);

  gulp.task('default', ['watch']);

  gulp.task('watch', function () {
    gulp.watch(js, ['dist', 'inject-files', 'clean']);
  });

})();
