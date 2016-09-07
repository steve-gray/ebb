import babel from 'gulp-babel';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('precopy', () =>
  gulp.src('./src/**/*')
    .pipe(gulp.dest('./dist')));

gulp.task('babel', ['precopy'], () =>
  gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist')));

gulp.task('lint', () =>
  gulp.src(['./src/**/*.js', './test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', ['lint'], () =>
  gulp.src('./test/**/*.spec.js', { read: false })
    .pipe(mocha()));

gulp.task('default', ['lint', 'babel', 'test']);
