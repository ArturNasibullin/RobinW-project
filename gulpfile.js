// Определяем переменную "preprocessor"
let preprocessor = "sass";

// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require("gulp");

// Подключаем Browsersync
const browserSync = require("browser-sync").create();

// Подключаем gulp-concat
const concat = require("gulp-concat");

// Подключаем gulp-uglify-es
const uglify = require("gulp-uglify-es").default;

// Подключаем модули gulp-sass и gulp-less
const sass = require("gulp-sass");

// Подключаем Autoprefixer
const autoprefixer = require("gulp-autoprefixer");

// Подключаем модуль gulp-clean-css
const cleancss = require("gulp-clean-css");

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");

// Подключаем модуль gulp-newer
const newer = require("gulp-newer");

// Подключаем модуль del
const del = require("del");

const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename"); //Подключаем бибилиотеку для переименования файлов;

// Определяем логику работы Browsersync
function browsersync() {
  browserSync.init({
    // Инициализация Browsersync
    server: { baseDir: "app/" }, // Указываем папку сервера
    notify: false, // Отключаем уведомления
    online: true, // Режим работы: true или false
  });
}

function libsJS() {
  return src(
    [
      // Берём файлы из источников
      "node_modules/jquery/dist/jquery.min.js", // Пример подключения библиотеки
      "app/js/libs/jquery.waypoints.js",
      "app/js/libs/parallaxie.js",
      "app/js/libs/typeit.min.js", // Пример подключения библиотеки
      // "app/js/app.js", // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
    ],
    { allowEmpty: true }
  )
    .pipe(concat("libs.min.js")) // Конкатенируем в один файл
    .pipe(uglify()) // Сжимаем JavaScript
    .pipe(dest("app/js/")) // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
}

function styles() {
  return src("app/sass/style.sass") // Выбираем источник
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat("style.min.css")) // Конкатенируем в файл style.min.js
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    ) // Создадим префиксы с помощью Autoprefixer
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
        // format: "beautify",
      })
    ) // Минифицируем стили
    .pipe(sourcemaps.write(".")) // создание карты css.map в текущей папке
    .pipe(dest("app/css/")) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

function images() {
  return src("app/img/src/**/*") // Берём все изображения из папки источника
    .pipe(newer("app/img/dest/")) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(
      imagemin({
        // С кешированием
        // .pipe(imagemin({ // Сжимаем изображения без кеширования
        interlaced: true,
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
      })
    ) // Сжимаем и оптимизируем изображеня
    .pipe(dest("app/images/dest/")); // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
  return del("app/images/dest/**/*", { force: true }); // Удаляем всё содержимое папки "app/images/dest/"
}

function buildcopy() {
  return src(
    [
      // Выбираем нужные файлы
      "app/css/**/*.css",
      "app/js/**/*.js",
      "app/img/dest/**/*",
      "app/**/*.html",
    ],
    { base: "app" }
  ) // Параметр "base" сохраняет структуру проекта при копировании
    .pipe(dest("dist")); // Выгружаем в папку с финальной сборкой
}

function cleandist() {
  return del("dist/**/*", { force: true }); // Удаляем всё содержимое папки "dist/"
}

function startwatch() {
  // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
  watch(["app/**/*.js", "!app/js/*.min.js"], libsJS);

  // Мониторим файлы препроцессора на изменения
  watch("app/**/" + preprocessor + "/**/*", styles);

  // Мониторим файлы HTML на изменения
  watch("app/**/*.html").on("change", browserSync.reload);

  // Мониторим папку-источник изображений и выполняем images(), если есть изменения
  watch("app/img/src/**/*", images);
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию libsJS() в таск libsJS
exports.libsJS = libsJS;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;

// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles, libsJS, images, buildcopy);

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, libsJS, browsersync, startwatch);
