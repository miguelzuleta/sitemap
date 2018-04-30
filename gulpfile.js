'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var gulpif       = require('gulp-if');
var sourcemaps   = require('gulp-sourcemaps');
var argv         = require('yargs').argv;
var electron     = require('electron-connect').server.create();

var defaultTasks = ['sass', 'serve']

if (argv.watch) {
	defaultTasks.push('watch');
}

gulp.task('sass', function() {
	gulp.src('components/sass/*.scss')
		.pipe(gulpif(argv.sourcemaps, sourcemaps.init()))
			.pipe(sass({
				outputStyle: 'expanded',
				sourceComments: true
			}).on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 5 versions'],
				cascade: false
			}))
			.pipe(rename('styles.built.css'))
		.pipe(gulpif(argv.sourcemaps, sourcemaps.write()))
		.pipe(gulp.dest('app'));
});

gulp.task('watch', function() {
	gulp.watch('index.html');
	gulp.watch('components/sass/**/*.scss', ['sass']);
});

gulp.task('serve', function () {
  electron.start();
  if (argv.watch) {
  	gulp.watch(
  		['app/styles.built.css', 'index.html', 'renderer.js', 'components/js/*.js'],
  		electron.reload
  	);
  }
});

gulp.task('default', defaultTasks);

