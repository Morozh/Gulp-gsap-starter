# Gulp-starter

## Что может эта сборка
 + Работать с препроцессорами **SCSS/PUG**
 + Работать с svg с помощью svg-lib **миксина**
 + Запустить **локальный сервер**
 + Транспилировать **ES6** код в ES5
 + Минифицировать файлы

## Опциональные библиотеки
 + GSAP

## Как развернуть среду для проекта
 1. Клонировать репозиторий — **`git clone https://github.com/nmihalyov/gulp-pure-start.git`** или скачиваем архив и в ручную распаковываем его
 2. В папке проекта выполнить команду **`yarn install`** (должен быть установлен [Node.JS](https://nodejs.org/en/) и [Yarn](https://yarnpkg.com/))
 3. Рекомендуется сначала выполнить команду `gulp misc` для удаления лишних файлов
 4. Чтобы сразу начать отслеживание файлов и запустить локальный сервер выполните команду **`gulp`** (уже можно работать!)
 5. Для загрузки популярных библиотек/плагинов и т.п. воспользуйте командой **`yarn add название_пакета`**. Все пакеты загружаются в папку *node_modules*.
 6. Для компиляции проекта в продакшен выполните команду **`gulp prod`**

## Рекомендации к использованию
1. Придерживайтесь изначальной структуры файлов/папок
2. **HTML** файлы по умолчанию компилируются в корень **build**, при необходимости можно изменить в  **gulpfile.js**: таск pug, строка **`.pipe(gulp.dest(${build}))`**
3. Все библиотеки устанавливаются в **node_modules**. Для их подключения используйте файл **js/libs.js** c директивой **@@include** (напр. **`@@include('../../node_modules/jquery/dist/jquery.js')`**), точно также можно импортировать несколько файлов JS в один результирующий для более удобной архитектуры (eсли вам надо подключить SCSS/CSS, то подключайте их в **_libs.scss** (который нужно импортировать в style.sass или подключать библиотеки сразу в нём)
4. По-умолчанию из SCSS-файлов компилируется только **style.scss**, остальные файлы стилей следует импротировать в него, или заменить строку таска **scss** **`return gulp.src('dev/scss/style.scss')`** на **`return gulp.src('dev/scss/*.scss')`**
5. Существует шаблон Pug для более быстрого старта - **dev/pug/index.pug**
6. В папке **dev/pug/assets** находятся следующие вспомогательные файлы разметки: **_base.pug** – базовые стили для всего проекта, **_links.pug** – содержит все теги link для раздела head, **_metas.pug** – содержит все теги meta для раздела head, **_og.pug** – метатеги OpenGraph, **_scripts.pug** – подключение скриптов
7. В папке **dev/scss/assets** находятся следующие вспомогательные файлы стилей: **_base.scss** – базовые стили для всего проекта, **_fonts.scss** – подключение всех шрифтов, **_mixins.scss** – файл для миксинов, **_vars.scss** – глобальные переменные для стилей проекта
