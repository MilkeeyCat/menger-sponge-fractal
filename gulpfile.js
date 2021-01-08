"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const browsersync = require("browser-sync").create();



/* Paths to source/build/watch files
=========================*/

var path = {
    build: {
        html: "dist/",
        js: "dist/assets/js/",
        css: "dist/assets/css/",
        images: "dist/assets/images/",
        fonts: "dist/assets/fonts/"
    },
    src: {
        html: "src/*.{htm,html,php}",
        js: "src/assets/js/*.js",
        css: "src/assets/sass/style.scss",
        images: "src/assets/images/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/fonts/**/*.*"
    },
    watch: {
        html: "src/**/*.{htm,html,php}",
        js: "src/assets/js/**/*.js",
        css: "src/assets/sass/**/*.scss",
        images: "src/assets/images/**/*.{jpg,png,svg,gif,ico}",
        fonts: "src/assets/images/**/*.*"
    },
    clean: "./dist"
};


/* Tasks
=========================*/

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: 'src/' })
        .pipe(plumber())
        .pipe(panini({
            root: 'src/',
            layouts: 'src/templates/layouts/',
            partials: 'src/templates/partials/',
            helpers: 'src/templates/helpers/',
            data: 'src/templates/data/'
        }))
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css, { base: './src/assets/sass/' })
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 8 versions"],
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js, { base: './src/assets/js/' })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.images)
        .pipe(dest(path.build.images));
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
    gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);


// export tasks
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
