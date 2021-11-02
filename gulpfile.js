'use strict';

const dev = './dev';     // рабочая среда проекта
const build = './build'; // рабочий билд
const prod = './prod';   // билд в продакшен

// Подключаем все необходимые плагины
const gulp     = require('gulp'),                       // Сам сборщик Gulp
  scss         = require('gulp-sass'),                  // Компиляция scss/SCSS
  mmq          = require('gulp-merge-media-queries'),   // Соединение медиа-запросов
  pug          = require('gulp-pug'),                   // Компиляция Pug
  browserSync  = require('browser-sync'),               // Запуск локального сервера
  babel        = require('gulp-babel'),                 // Транспиляция ES6 в ES5
  sourcemaps   = require('gulp-sourcemaps'),            // Sourcemap'ы к файлам
  critical     = require('critical').stream,            // Создание критических стилей
  del          = require('del'),                        // Удаление файлов директории
  imagemin     = require('gulp-imagemin'),              // Минификация изображений (в зависимостях также идут дополнительные пакеты)
  autoprefixer = require('gulp-autoprefixer'),          // Расстановка вендорных перфиксов
  plumber      = require('gulp-plumber'),               // Предотвращение разрыв pipe'ов, вызванных ошибками gulp-плагинов
  notify       = require('gulp-notify'),                // Вывод уведомления
  importFile   = require('gulp-file-include'),          // Импорт файлов (@@include('path/to/file'))
  imageminJpeg = require('imagemin-mozjpeg'),
  imageminPng  = require('imagemin-pngquant');

// Компилируем scss (можно изменить на SASS) в CSS и добавляем вендорные префиксы
gulp.task('scss', () => {
  return gulp.src(`${dev}/scss/style.scss`)
  .pipe(sourcemaps.init())
  .pipe(scss({
    outputStyle: ':nested'
  }))
  .on('error', notify.onError({
    title: 'scss',
    message: '<%= error.message %>'
  }))
  .pipe(autoprefixer(['last 15 versions', '> 1%'], {cascade: false}))
  .pipe(mmq())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${build}/css`))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Таск scss для продакшена, без sourcemap'ов
gulp.task('_scss',  () => {
  return gulp.src(`${dev}/scss/style.scss`)
  .pipe(scss())
  .pipe(autoprefixer(['last 15 versions', '> 1%'], {cascade: false}))
  .pipe(mmq())
  .pipe(gulp.dest(`${prod}/css`));
});

// Компилируем Pug в HTML без его минификации
gulp.task('pug',  () => {
  return gulp.src(`${dev}/pug/*.pug`)
  .pipe(pug({
    pretty: true
  }))
  .on('error', notify.onError({
    title: 'PUG',
    message: '<%= error.message %>'
  }))
  .pipe(gulp.dest(`${build}`))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Таск PUG для продакшена - генерация критических стилей
gulp.task('_pug', () => {
  return gulp.src(`${dev}/pug/*.pug`)
  .pipe(pug({
    pretty: true
  }))
  .pipe(critical({
    base: `${build}/`,
    minify: true,
    inline: true,
    width: 1920,
    height: 1280,
    css: [`${build}/css/style.css`]
  }))
  .on('error', notify.onError({
    title: 'PUG',
    message: '<%= error.message %>'
  }))
  .pipe(gulp.dest(`${prod}`));
});

// Подключаем JS файлы результирующего файла common.js, конкатенируем и минифицируем
gulp.task('scripts', () => {
  return gulp.src(`${dev}/js/common.js`)
  .pipe(plumber({
    errorHandler: notify.onError({
      title: 'JavaScript',
      message: '<%= error.message %>'
    })
  }))
  .pipe(importFile({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${build}/js`))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Таск scripts для продакшена, без sourcemap'ов
gulp.task('_scripts', () => {
  return gulp.src(`${dev}/js/common.js`)
  .pipe(importFile({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(gulp.dest(`${prod}/js`))
});

// Подключаем JS файлы бибилотек конкатенируем их и минифицируем
gulp.task('jsLibs', () => {
  return gulp.src(`${dev}/js/libs.js`)
  .pipe(plumber({
    errorHandler: notify.onError({
      title: 'JavaScript',
      message: '<%= error.message %>'
    })
  }))
  .pipe(importFile({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(gulp.dest(`${build}/js`))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Минифицируем изображения
gulp.task('img', () => {
  return gulp.src(`${dev}/img/**/*`)          // путь ко всем изображениям
  .pipe(imagemin([                            // сжатие изображений без потери качества
    imageminJpeg(),                           // сжатие jpeg
    imageminPng()                             // сжатие png
  ], {
    progressive: true,
    strip: true
  }))
  .pipe(gulp.dest(`${build}/img`));           // путь вывода файлов
});

// Переносим шрифты
gulp.task('fonts', () => {
  return gulp.src(`${dev}/fonts/**/*`)
  .pipe(gulp.dest(`${build}/fonts`));
});

// Запускаем наш локальный сервер
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: `${build}`
    },
    notify: false
  });
});

// Переносим файл манифеста в папку build
gulp.task('manifest', () => {
  return gulp.src(`${dev}/manifest.json`)
  .pipe(gulp.dest(`${build}/`));
});

// Следим за изменениями файлов и выполняем соответствующие таски
gulp.task('default', gulp.parallel('scss', 'img', 'pug', 'jsLibs', 'scripts', 'fonts', 'manifest', 'browser-sync', () => {
  // стили
  gulp.watch(`${dev}/**/*.scss`, gulp.series('scss'));
  // разметка
  gulp.watch(`${dev}/**/*.pug`, gulp.series('pug'));
  // скрипты
  gulp.watch(`${dev}/**/*.js`, gulp.series('scripts'));
  // скрипты библиотек
  gulp.watch(`${dev}/js/libs.js`, gulp.series('jsLibs'));
  // шрифты
  gulp.watch(`${dev}/fonts/**/*`, gulp.series('fonts'));
  // изображения
  gulp.watch(`${dev}/img/**/*`, gulp.series('img'));
  // манифест
  gulp.watch(`${dev}/manifest.json`, gulp.series('manifest'));
}));

// Удаляем все лишние файлы: '.gitkeep', 'changelog.md' и 'readme.md'
gulp.task('misc', async () => {
  return del.sync(['**/.gitkeep', '.assets', 'changelog.md', 'readme.md']);
});

// Очищаем директорию продакшен билда
gulp.task('clean', async () => {
  return del.sync(`${prod}/**/*`);
});

// Собираем наш билд в продакшен
gulp.task('prod', gulp.series('clean', 'img', '_scss', '_pug', 'jsLibs', '_scripts', async () => {
  // Собираем JS
  gulp.src(`${build}/js/libs.js`)
  .pipe(gulp.dest(`${prod}/js`));

  // Собираем шрифты
  gulp.src(`${dev}/fonts/**/*`)
  .pipe(gulp.dest(`${prod}/fonts`));

  // Собираем изображения
  gulp.src(`${build}/img/**/*`)
  .pipe(gulp.dest(`${prod}/img`));

  // Собираем manifest.json
  gulp.src(`${dev}/manifest.json`)
  .pipe(gulp.dest(`${prod}/`));
}));
