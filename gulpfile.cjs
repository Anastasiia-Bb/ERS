
const { src, dest, watch, series, parallel } = require("gulp");
const sassCompiler = require("sass");
const gulpSass = require("gulp-sass")(sassCompiler);
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const browserSync = require("browser-sync").create();

// 1. HTML копируется в готовую папку
function html() {
  return src("src/*.html")
    .pipe(dest("dist"));
}

// 2. SCSS превращается в CSS для разработки
function styles() {
  return src("src/styles/main.sass")
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// 3. JavaScript копируется без минификации
function scripts() {
  return src("src/js/**/*.js")
    .pipe(dest("dist/js"));
}

// 4. Изображения копируются в готовую папку
function images() {
  return src("src/assets/**/*", { allowEmpty: true })
    .pipe(dest("dist/assets"));
}

// 5. Минификация CSS для публикации
function minifyCSS() {
  return src("src/styles/main.sass")
    .pipe(gulpSass({ style: "compressed" })
      .on("error", gulpSass.logError))
    .pipe(cleanCSS())
    .pipe(dest("dist/css"));
}

// 6. Минификация JavaScript для публикации
function minifyJS() {
  return src("src/js/**/*.js", { allowEmpty: true })
    .pipe(terser())
    .pipe(dest("dist/js"));
}

// 7. Первоначальная сборка для разработки
const buildDev = parallel(html, styles, scripts, images);

// 8. Полная сборка для публикации
const build = parallel(html, minifyCSS, minifyJS, images);

// 9. Вотчер и автоматическое обновление браузера
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
    notify: false
  });

  watch("src/*.html", series(html, reload));
  watch("src/styles/**/*.sass", styles);
  watch("src/js/**/*.js", series(scripts, reload));
  watch("src/images/**/*", series(images, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

exports.build = build;
exports.default = series(buildDev, serve);
exports.styles = styles;