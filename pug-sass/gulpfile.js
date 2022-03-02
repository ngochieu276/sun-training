const { src, dest, parallel, watch, series } = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass")(require("sass"));
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

const FilesPath = {
  sassFiles: "scss/*.scss",
  jsFiles: "js/*.js",
  htmlFiles: "pages/*.pug",
};

function sassTask() {
  return src("scss/*.scss")
    .pipe(sass())
    .pipe(concat("style.css"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function htmlTask() {
  return src("pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function jsTask() {
  return src("js/*.js").pipe(concat("all.js")).pipe(dest("dist/js"));
}

function assetsTask() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function serve() {
  browserSync.init({ server: { baseDir: "./dist" } });
  watch("scss/*.scss", sassTask);
  watch("js/*.js", jsTask);
  watch("pug/*.pug", htmlTask);
}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask;
exports.assets = assetsTask;
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask));
