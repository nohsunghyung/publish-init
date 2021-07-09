var gulp = require("gulp");
var sass = require("gulp-sass");
var sassGlob = require("gulp-sass-glob");
var clean = require("gulp-clean");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var sourcemaps = require("gulp-sourcemaps");
var removeSourcemaps = require("gulp-remove-sourcemaps");
var ifElse = require("gulp-if-else");
var gulpif = require("gulp-if");
const gulpIf = require("gulp-if");

const server = browserSync.create();

// html, css, js 경로
const paths = {
  css: {
    src: "./resources/scss/**/*.scss",
    dest: "./resources/css/",
  },
  html: {
    src: "./html/*.html",
  },
  js: {
    src: "./html/*.html",
  },
};

// scss 컴파일
function css_compile(bool) {
  return gulp
    .src(paths.css.src)
    .pipe(gulpif(bool, sourcemaps.init()))
    .pipe(
      sass
        .sync({
          outputStyle: "compact",
          sourcemap: bool,
        })
        .on("error", sass.logError)
    )
    .pipe(gulpif(bool, sourcemaps.write()))
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
  return gulp.src(paths.css.dest, { read: false }).pipe(clean());
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
    files: ["html/*.{html}", "resources/**/*.{css,js,img}"],
    server: { baseDir: "./" },
    startPath: "html/index.html",
    browser: "chrome",
  });
  done();
}

// watch 감시
const watch = () => {
  gulp.watch(paths.css.src, gulp.series(css_compile_dev, reload));
  gulp.watch(paths.html.src).on("change", server.reload);
  gulp.watch(paths.js.src).on("change", server.reload);
};

const dev = gulp.series(css_compile_dev, serve, watch);
const build = gulp.series(css_clean, css_compile_build);

// 터미널 입력 명령어
exports.dev = dev;
exports.build = build;
