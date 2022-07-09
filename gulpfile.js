const { src, dest, watch, parallel, series } = require("gulp"),
    sync = require("browser-sync").create(),
    pug = require("gulp-pug"),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require("gulp-autoprefixer"),
    jshint = require("gulp-jshint"),
    stylish = require("jshint-stylish"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    minifycss = require("gulp-minify-css"),
    spritesmith = require('gulp.spritesmith'),
    consolidate = require('gulp-consolidate'),
    iconfont = require('gulp-iconfont');

async = require('async');

var runTimestamp = Math.round(Date.now() / 1000);
function iconProcess(cb) {
    var iconStream = src(['./src/icons/**.svg'])
        .pipe(iconfont({
            fontName: 'ficon',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1001
        }));

    async.parallel([
        function handleGlyphs(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                console.log(glyphs);
                src('src/icons/icons.scss')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        cacheBuster: '?v=1.0.1',
                        fontName: 'ficon',
                        fontPath: '../font/',
                        className: 'ficon'
                    }))
                    .pipe(dest('src/sass/'))
                    .on('finish', cb);
            });
        },
        function handleFonts(cb) {
            iconStream
                .pipe(dest('src/font/'))
                .on('finish', cb);
        }
    ], cb);

    cb();
}


function fontProcess(cb) {
    src("./src/font/**.*")
        .pipe(dest("./build/font"))
        .pipe(sync.stream());
    cb();
}
function pugProcess(cb) {
    src("./src/*.pug")
        .pipe(pug({}))
        .pipe(dest("./build"))
        .pipe(sync.stream());
    cb();
}

function scriptPorcess(cb) {
    src(['./src/scripts/plugins/**.js', './src/scripts/**.js'])
        //.pipe(jshint())
        //.pipe(jshint.reporter(stylish))
        .pipe(concat('main.js'))
        .pipe(dest('build/scripts'))
        .pipe(uglify())
        .pipe(sync.stream())
        .pipe(dest('build/scripts'))
    cb();
}

function cssPorcess(cb) {
    src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(dest('./build/css'))
        .pipe(minifycss())
        .pipe(sync.stream())
        .pipe(dest('./build/css'));
    cb();
}

function spriteProcess(cb) {
    var spriteData = src('./src/images/*.png')
        .pipe(spritesmith({
            imgName: '../images/sprite.png',
            cssName: 'sprite.scss'
        }));

    spriteData.img.pipe(dest('./build/images'));
    spriteData.css.pipe(dest('./src/sass'));
    cb();
}


function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./build"
        }
    });

    watch('./src/scripts/**/**.js', scriptPorcess);
    watch('./src/sass/**/**.scss', cssPorcess);
    watch('./src/**/**.pug', pugProcess);
    watch('./src/images/**.*', spriteProcess);
    watch('./src/icons/**.svg', iconProcess);
    watch('./src/font/**.*', fontProcess);
    cb();
}

exports.start = parallel(cssPorcess, scriptPorcess, pugProcess, browserSync);
exports.build = parallel(iconProcess, spriteProcess, cssPorcess, fontProcess, scriptPorcess, pugProcess, browserSync);
exports.default = exports.start;