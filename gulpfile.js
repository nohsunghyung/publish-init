var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var pretty = require('gulp-pretty-html');
var removeSourcemaps = require('gulp-remove-sourcemaps');
var ifElse = require('gulp-if-else');
var gulpIf = require('gulp-if');
var fileinclude = require('gulp-file-include');
var removeEmptyLines = require('gulp-remove-empty-lines');

const server = browserSync.create();

// html, css, js 경로
const paths = {
  css: {
    src: './resources/scss/**/*.scss',
    dest: './resources/css/',
  },
  html: {
    src: './html-dev/**/**.html',
    watch: ['./html-dev/', './includes/'],
    dest: './html/',
  },
  js: {
    src: './html/*.html',
  },
};

// scss 컴파일
function css_compile(bool) {
  return gulp
    .src(paths.css.src)
    .pipe(gulpIf(bool, sourcemaps.init()))
    .pipe(
      sass
        .sync({
          outputStyle: 'compact',
          sourcemap: bool,
        })
        .on('error', sass.logError)
    )
    .pipe(gulpIf(bool, sourcemaps.write()))
    .pipe(gulpIf(!bool, removeSourcemaps()))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.css.dest));
}

// scss 컴파일 완료
function css_compile_dev(done) {
  css_compile(true);
  done();
}

// scss 빌드 완료
function css_compile_build(done) {
  css_compile(false);
  done();
}

// css clean
function css_clean() {
  return gulp.src(paths.css.dest, {read: false}).pipe(clean());
}

// html 컴파일
function html_compile() {
  return gulp
    .src(paths.html.src)
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(removeEmptyLines())
    .pipe(
      pretty({
        indent_size: 2,
        indent_char: '	',
        end_with_newlines: true,
      })
    )
    .pipe(gulp.dest(paths.html.dest));
}

// html 컴파일 완료
function html_compile_dev(done) {
  html_compile();
  done();
}

// html clean
function html_clean() {
  return gulp.src(paths.html.dest, {read: false}).pipe(clean());
}

// 새로고침
function reload(done) {
  server.reload();
  done();
}

// 서버 셋팅
function serve(done) {
  server.init({
    port: 9000,
    files: ['html/*.{html}', 'resources/**/*.{css,js,img}'],
    server: {baseDir: './'},
    startPath: 'html/index.html',
    browser: 'chrome',
    reloadDelay: 800,
  });
  done();
}

// watch 감시
var watch = () => {
  gulp.watch(paths.css.src, gulp.series(css_compile_dev, reload));
  gulp.watch(paths.html.watch, gulp.series(html_clean, html_compile_dev, reload));
  gulp.watch(paths.js.src);
};

var dev = gulp.series(html_compile_dev, css_compile_dev, serve, watch);
var build = gulp.series(html_clean, css_clean, html_compile_dev, css_compile_build);

// 터미널 입력 명령어
exports.dev = dev;
exports.build = build;
